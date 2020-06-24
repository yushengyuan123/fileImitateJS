import {views} from "../positionViews/positionViews";
import {file_type, folderSize, fontSize} from "../index";
import {position} from "./interface";
import {FCB} from "../FCB/FCB";
import {decreaseDiskSpace} from "../utils/diskUtils";


/**
 * 创建指令
 */
export let create = function (file_name: string, config: {
    content?: string,
    fileType: file_type
    recentWriterTime?: string,
    recentReadTime?: string,
}): void {
    //获取第一块空闲区域
    //todo 获取完之后你还有分一个块给他
    const freeRegion: position | boolean = views.getFirstFreesRegion()

    if (typeof freeRegion !== "boolean") {
        //获取文件的大小
        const size = config.content ? getFileSize(config.fileType, config.content)
            : getFileSize(config.fileType)

        //创建一个FCB
        const fcb: FCB = initFCB(file_name, config, freeRegion, size);

        //改变磁盘空间
        if (decreaseDiskSpace(size)) {
            console.log('磁盘空间改变成功')
        } else {
            console.log('磁盘空间已经满了')
        }
    } else {
        console.log('磁盘空间已经满了')
    }
}

/**
 * 获得文件的大小，假如是folder文件固定256个字节，假如是txt看字数
 * @param type
 * @param content
 */
function getFileSize(type: file_type, content?: string): number {
    if (file_type.folder === type) {
        return folderSize
    } else {
        const len = content.length
        return len * fontSize
    }
}

/**
 * 初始化FCB各种参数
 * @param file_name
 * @param config
 * @param freeRegion
 * @param size
 */
function initFCB(file_name: string, config: {
    content?: string,
    fileType: file_type
    recentWriterTime?: string,
    recentReadTime?: string,
}, freeRegion: position | boolean, size: number): FCB {
    //创建一个FCB
    const fcb: FCB = new FCB();
    //设置已经占用的位置
    if (typeof freeRegion !== "boolean") {
        views.setHasUsed(freeRegion.columns, freeRegion.rows);
    }
    //设置物理块号
    if (typeof freeRegion !== "boolean") {
        fcb.physical_position = views.transformIndex(freeRegion.columns, freeRegion.rows)
    }
    //设置文件名称
    fcb.file_name = file_name
    //设置文件类型
    fcb.type = config.fileType
    //设置文件最近读的时间
    fcb.recentlyReadTime = config.recentReadTime
    //设置文件最近写的时间
    fcb.recentlyWriteTime = config.recentWriterTime
    //初始化FCB大小
    fcb.size = size

    return fcb
}
