"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionViews_1 = require("../positionViews/positionViews");
const index_1 = require("../index");
const FCB_1 = require("../FCB/FCB");
const diskUtils_1 = require("../utils/diskUtils");
const viewsUtils_1 = require("../positionViews/viewsUtils");
/**
 * 创建指令
 */
exports.create = function (file_name, config) {
    //获取第一块空闲区域，包含了空闲盘块的行和列信息。
    const freeRegion = positionViews_1.views.getFirstFreesRegion();
    if (typeof freeRegion !== "boolean") {
        //获取文件的大小
        const size = config.content ? getFileSize(config.fileType, config.content)
            : getFileSize(config.fileType);
        //创建一个FCB
        const fcb = initFCB(file_name, config, freeRegion, size);
        //改变磁盘的盘块的指针信息
        setDiscBlock(freeRegion, fcb);
        //改变磁盘空间
        if (!diskUtils_1.decreaseDiskSpace(size)) {
            throw new Error('磁盘空间不够用');
        }
    }
    else {
        console.log('磁盘空间已经满了');
    }
};
/**
 * 改变磁盘的盘块的指针信息
 * @desc 这里要做几件事情。第一：要判断出这个文件会占用多少空间直接影响到它需要多少个盘块
 * 第二：要把位示图中所占用的盘块数值全部置为1
 * 第三：要设置好盘块下一个盘块的指针的值
 */
function setDiscBlock(freeRegion, fcb) {
    if (typeof freeRegion === "boolean") {
        return;
    }
    //获得文件的大小
    const file_size = fcb.size;
    //文件会占用的盘区的数目
    const occupy_number = Math.ceil(file_size / index_1.discBlockSize);
    //寻找有没有这么多的盘块数目，获取当前空闲盘块数目和下标,得到的是物理块号数组
    const free_blocks = viewsUtils_1.getCurrentFreeBlocksIndexAndNumber(occupy_number);
    if (typeof free_blocks !== 'boolean') {
        //开始初始化这个盘块的信息和位示图置为1
        viewsUtils_1.setViewsOne(free_blocks);
        //盘块的下一个指针赋值
        if (!viewsUtils_1.valuesPointer(free_blocks)) {
            throw new Error('赋值异常，某个盘块已经被占用了');
        }
    }
    else {
        console.log('当前空间不足够');
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
        const len = content.length;
        return len * index_1.fontSize;
    }
}
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
    //设置已经占用的位置
    if (typeof freeRegion !== "boolean") {
        positionViews_1.views.setHasUsed(freeRegion.columns, freeRegion.rows);
    }
    //设置物理块号
    if (typeof freeRegion !== "boolean") {
        fcb.physical_position = positionViews_1.views.transformIndex(freeRegion.columns, freeRegion.rows);
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
