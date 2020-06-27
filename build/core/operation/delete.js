"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otherUtils_1 = require("../utils/otherUtils");
const disc_1 = require("../disc/disc");
const positionViews_1 = require("../positionViews/positionViews");
const index_1 = require("../index");
const userCatalogue_1 = require("../catalogue/userCatalogue");
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
    //这里还要注意假如删除的是文件夹，那么还要移除catalogue数组，如果只是txt则不需要
    for (let i = 0, list = deleteCatalogue.files_list; i < list.length; i++) {
        if (name === list[i].file_name) {
            deleteFCB = list[i];
            break;
        }
    }
    //将位示图置为0， 顺便把next指针置为null
    removeFromViews(deleteFCB);
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
        console.log(concatPath);
        for (let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
            console.log(list[i].path);
            if (list[i].path === concatPath) {
                let index = list.indexOf(list[i]);
                if (index > -1) {
                    list.splice(index, 1);
                }
                break;
            }
        }
    }
    console.log(positionViews_1.views.getViews());
    console.log(userCatalogue_1.UserRoot);
}
exports.deleteFiles = deleteFiles;
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
        console.log(columns_rows);
        if (!positionViews_1.views.removeUsed(columns_rows.columns, columns_rows.rows)) {
            throw new Error('出现异常，有空间已经被占用');
        }
    });
}
exports.removeFromViews = removeFromViews;
/**
 * 从磁盘分区移除
 */
function removeFromCatalogueList() {
}
exports.removeFromCatalogueList = removeFromCatalogueList;
