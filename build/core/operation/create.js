"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionViews_1 = require("../positionViews/positionViews");
const index_1 = require("../index");
const FCB_1 = require("../FCB/FCB");
const diskUtils_1 = require("../utils/diskUtils");
const viewsUtils_1 = require("../positionViews/viewsUtils");
const catalogue_1 = require("../catalogue/catalogue");
const catalogueUtil_1 = require("../catalogue/catalogueUtil");
const verify_1 = require("../utils/verify");
const otherUtils_1 = require("../utils/otherUtils");
/**
 * 创建指令
 */
exports.create = function (file_name, config) {
    //获取第一块空闲区域，包含了空闲盘块的行和列信息。
    const freeRegion = positionViews_1.views.getFirstFreesRegion();
    let size;
    //新建立文件的重名校验
    verify_1.Verify.pathIsTheSame(config.path, file_name);
    //todo 更新完这个TXT的大小内容，接下来就要更新它所在上一级目录的内存占用情况。更目录除外,同时还要更新磁盘的空间
    if (typeof freeRegion !== "boolean") {
        //获取文件的大小
        if (config.fileType === index_1.file_type.folder) {
            size = getFileSize(config.fileType);
        }
        else {
            size = getFileSize(config.fileType, config.content);
        }
        //创建一个FCB
        const fcb = initFCB(file_name, config, freeRegion, size);
        //改变磁盘的盘块的指针信息
        setDiscBlock(freeRegion, fcb, config.fileType);
        //将FCB写入目录信息中
        writeFCBInCatalogue(fcb, config);
        //如果是folder才更新目录的所有指针,创建一个新的目录
        if (config.fileType === index_1.file_type.folder) {
            const catalogue = new catalogue_1.Catalogue();
            writeFCBInCatalogue(fcb, config, file_name, catalogue);
        }
        //改变磁盘空间
        if (!diskUtils_1.decreaseDiskSpace(size)) {
            throw new Error('磁盘空间不够用');
        }
    }
    else {
        throw new Error('磁盘空间已经满了');
    }
};
/**
 * 将FCB信息写入目录当中
 * 遍历首先看看是哪个用户的，像根据用户进行筛选，然后看看他的路径，再根据路径进行筛选这样效率比较高
 * 将FCB写入Array<FCB>中
 * 无论是什么文件类型都把FCB和目录都分别插入两个数组中，方便查询
 */
function writeFCBInCatalogue(fcb, config, file_name, catalogue) {
    //多少层的目录
    const layer = config.path.split('/');
    let temp;
    let matchStr = '';
    temp = otherUtils_1.getRootCatalogue();
    catalogueUtil_1.removeNone(layer);
    if (config.path !== '/') {
        //现在更目录匹配一波
        //寻找创建文件的目录
        for (let i = 0; i < layer.length; i++) {
            matchStr += '/' + layer[i];
            for (let j = 0; j < temp.child.length; j++) {
                //路径命中
                if (matchStr === temp.child[j].path) {
                    temp = temp.child[j];
                    break;
                }
            }
        }
    }
    if (catalogue) {
        //todo 这里还有一个用户名是没有赋值的，不知道有没有必要
        temp.child.push(catalogue);
        catalogue.parent = temp;
        catalogue.path = matchStr + '/' + file_name;
    }
    else {
        temp.files_list.push(fcb);
    }
}
/**
 * 改变磁盘的盘块的指针信息
 * @desc 这里要做几件事情。第一：要判断出这个文件会占用多少空间直接影响到它需要多少个盘块
 * 第二：要把位示图中所占用的盘块数值全部置为1
 * 第三：要设置好盘块下一个盘块的指针的值
 */
function setDiscBlock(freeRegion, fcb, type) {
    if (typeof freeRegion === "boolean") {
        return;
    }
    //获得文件的大小
    const file_size = fcb.size;
    //文件会占用的盘区的数目
    const occupy_number = fcb.occupy_number;
    //寻找有没有这么多的盘块数目，获取当前空闲盘块数目和下标,得到的是物理块号数组
    const free_blocks = viewsUtils_1.getCurrentFreeBlocksIndexAndNumber(occupy_number);
    if (typeof free_blocks !== 'boolean') {
        //开始初始化这个盘块的信息和位示图置为1
        console.log('类型', type);
        if (type === index_1.file_type.txt) {
            console.log('我进来了', free_blocks);
            viewsUtils_1.setViewsOne(free_blocks);
            //盘块的下一个指针赋值
            if (!viewsUtils_1.valuesPointer(free_blocks)) {
                throw new Error('赋值异常，某个盘块已经被占用了');
            }
        }
    }
    else {
        throw new Error('当前空间不足够');
    }
}
/**
 * 获得文件的大小，假如是folder文件固定256个字节，假如是txt看字数
 * @param type
 * @param content
 */
function getFileSize(type, content) {
    if (index_1.file_type.folder === type) {
        return index_1.folderSize;
    }
    else {
        if (content !== null) {
            const len = content.length;
            return len * index_1.fontSize;
        }
        return 0;
    }
}
exports.getFileSize = getFileSize;
/**
 * 初始化FCB各种参数
 * @param file_name
 * @param config
 * @param freeRegion
 * @param size
 */
function initFCB(file_name, config, freeRegion, size) {
    //创建一个FCB
    const fcb = new FCB_1.FCB();
    //设置物理块号
    if (typeof freeRegion !== "boolean") {
        if (config.fileType === index_1.file_type.txt) {
            fcb.physical_position = positionViews_1.views.transformIndex(freeRegion.columns, freeRegion.rows);
        }
        else {
            fcb.physical_position = null;
        }
    }
    //设置占用盘块数目，目录文件设置不占用盘块
    if (config.fileType === index_1.file_type.txt) {
        fcb.occupy_number = 1;
    }
    else {
        fcb.occupy_number = 0;
    }
    //设置文件名称
    fcb.file_name = file_name;
    //设置文件类型
    fcb.type = config.fileType;
    //设置文件最近读的时间
    fcb.recentlyReadTime = config.recentReadTime;
    //设置文件最近写的时间
    fcb.recentlyWriteTime = config.recentWriterTime;
    //初始化FCB大小
    fcb.size = size;
    return fcb;
}
