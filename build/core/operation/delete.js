"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otherUtils_1 = require("../utils/otherUtils");
const disc_1 = require("../disc/disc");
const positionViews_1 = require("../positionViews/positionViews");
const index_1 = require("../index");
/**
 * 删除文件操作
 * 删除操作要从位示图移除，从磁盘分区移除, 还要把disc的磁盘分区指针指null
 * @param path
 * @param name
 * @param type
 */
function deleteFiles(path, name, type) {
    const deleteCatalogue = otherUtils_1.entryCatalogue(path);
    let deleteFCB;
    let deleteSize;
    let cacheCatalogue;
    //进入到需要删除的目录
    for (let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
        let newPath;
        if (path === '/') {
            newPath = path + name;
        }
        else {
            newPath = path + '/' + name;
        }
        if (list[i].path === newPath) {
            cacheCatalogue = list[i];
        }
    }
    //这里还要注意假如删除的是文件夹，那么还要移除catalogue数组，如果只是txt则不需要
    for (let i = 0, list = deleteCatalogue.files_list; i < list.length; i++) {
        if (name === list[i].file_name) {
            deleteSize = list[i].size;
            deleteFCB = list[i];
            break;
        }
    }
    //删除文件夹，和删除txt文件处理是不一样的
    if (type === index_1.file_type.txt) {
        //断开磁盘的nextIndex指针
        removeFromDisc(deleteFCB);
        //将位示图置为0， 顺便把next指针置为null
        removeFromViews(deleteFCB);
    }
    //向上减少文件夹的大小
    decreaseUpCatalogue(deleteCatalogue, deleteSize);
    //释放磁盘空间的大小
    freeDiscSpace(deleteSize);
    //从FCB移除
    let index = deleteCatalogue.files_list.indexOf(deleteFCB);
    if (index > -1) {
        deleteCatalogue.files_list.splice(index, 1);
    }
    if (type === index_1.file_type.folder) {
        let concatPath;
        //假如是文件夹从catalogueList下移除, 从目录数据结构的path路径区匹配
        if (path === '/') {
            concatPath = path + name;
        }
        else {
            concatPath = path + '/' + name;
        }
        for (let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
            if (list[i].path === concatPath) {
                cacheCatalogue = list[i];
                let index = list.indexOf(list[i]);
                if (index > -1) {
                    list.splice(index, 1);
                }
                break;
            }
        }
        removeViewsAsFolder(cacheCatalogue);
    }
}
exports.deleteFiles = deleteFiles;
/**
 * 删除完文件后释放磁盘空间的大小
 */
function freeDiscSpace(deleteSize) {
    if (index_1.discSize >= deleteSize) {
        // @ts-ignore
        index_1.discSize += deleteSize;
    }
    else {
        throw new Error('删除空间大于磁盘空间， 磁盘大小分配错误');
    }
}
/**
 * 断开磁盘下和该文件相关的nextIndex指针
 * 删除txt则直接寻找就好了，但是假如删除的是folder你要逐级向下寻找所有的txt
 */
function removeFromDisc(needUpdateFCB) {
    //获得删除FCB第一块磁盘的物理地址
    let firstIndex = needUpdateFCB.physical_position;
    //获得该盘曲
    let firstDisc = disc_1.discMemory.getOneDiscBlocksInfo(firstIndex);
    let temp;
    for (let i = 0; i < needUpdateFCB.occupy_number - 1; i++) {
        temp = disc_1.discMemory.getOneDiscBlocksInfo(firstDisc.nextIndex);
        if (firstDisc.nextIndex !== null) {
            firstDisc.nextIndex = null;
        }
        else {
            throw new Error('移除指针发生异常，指针原来就是空的');
        }
        firstDisc = temp;
    }
}
exports.removeFromDisc = removeFromDisc;
/**
 * 删除文件夹子后，对应文件夹下所有的txt都要从磁盘移除
 */
function removeViewsAsFolder(deleteCatalogue) {
    if (deleteCatalogue.child.length !== 0) {
        for (let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
            removeViewsAsFolder(list[i]);
        }
    }
    const files = deleteCatalogue.files_list;
    if (files.length !== 0) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].type === index_1.file_type.txt) {
                removeFromViews(files[i]);
                removeFromDisc(files[i]);
            }
        }
    }
}
exports.removeViewsAsFolder = removeViewsAsFolder;
/**
 * 改变上级目录所有的内存占用
 */
function decreaseUpCatalogue(deleteCatalogue, size) {
    //如果修改的已经是根目录那就不用向上递归修改了
    if (deleteCatalogue.parent === null) {
        return;
    }
    //获取上一级目录的名称
    let name = deleteCatalogue.path.substring(deleteCatalogue.path.lastIndexOf('/') + 1);
    if (name === '') {
        name = '/';
    }
    recursiveDelete(size, deleteCatalogue.parent, name);
}
exports.decreaseUpCatalogue = decreaseUpCatalogue;
/**
 * 递归减少folder文件的大小
 */
function recursiveDelete(decreaseSize, catalogue, name) {
    if (catalogue === null) {
        return;
    }
    else {
        //获取上一级目录的名称
        let child_name = catalogue.path.substring(catalogue.path.lastIndexOf('/') + 1);
        if (child_name === '') {
            child_name = '/';
        }
        recursiveDelete(decreaseSize, catalogue.parent, child_name);
        const fcb = otherUtils_1.getCatalogueFCB(catalogue, name);
        fcb.size -= decreaseSize;
    }
}
exports.recursiveDelete = recursiveDelete;
/**
 * 从位示图去除
 */
function removeFromViews(deleteFCB) {
    //要知道他在位示图哪一个位置，就必须知道所占用的外存盘块号
    //从fcb的起始盘块号码和占用盘块数量得知占用的盘块号码再结合盘块的next指针把整一条链子找出来
    const index = deleteFCB.physical_position;
    const occupy_number = deleteFCB.occupy_number;
    //在磁盘中查询对应的盘块好码,这个是起始盘块的物理位置
    let target_blocks = disc_1.discMemory.getOneDiscBlocksInfo(index);
    //收集这些这个文件所用的物理盘块号，形成一个数组
    const collectIndex = [];
    let temp;
    for (let i = 0; i < occupy_number; i++) {
        collectIndex.push(target_blocks.index);
        temp = target_blocks.nextIndex;
        target_blocks.nextIndex = null;
        target_blocks = disc_1.discMemory.getOneDiscBlocksInfo(temp);
    }
    collectIndex.forEach((value) => {
        const columns_rows = positionViews_1.views.transformRows(value);
        if (!positionViews_1.views.removeUsed(columns_rows.columns, columns_rows.rows)) {
            throw new Error('出现异常，有空间已经被占用');
        }
    });
}
exports.removeFromViews = removeFromViews;
