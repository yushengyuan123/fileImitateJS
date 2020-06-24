"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionViews_1 = require("../positionViews/positionViews");
const index_1 = require("../index");
const FCB_1 = require("../FCB/FCB");
const diskUtils_1 = require("../utils/diskUtils");
/**
 * 创建指令
 */
exports.create = function (file_name, config) {
    //获取第一块空闲区域
    //todo 获取完之后你还有分一个块给他
    const freeRegion = positionViews_1.views.getFirstFreesRegion();
    if (typeof freeRegion !== "boolean") {
        //获取文件的大小
        const size = config.content ? getFileSize(config.fileType, config.content)
            : getFileSize(config.fileType);
        //创建一个FCB
        const fcb = initFCB(file_name, config, freeRegion, size);
        //改变磁盘空间
        if (diskUtils_1.decreaseDiskSpace(size)) {
            console.log('磁盘空间改变成功');
        }
        else {
            console.log('磁盘空间已经满了');
        }
    }
    else {
        console.log('磁盘空间已经满了');
    }
};
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
