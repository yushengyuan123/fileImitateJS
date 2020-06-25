import {views} from "../positionViews/positionViews";
import {discBlockSize, discSize, file_type, folderSize, fontSize} from "../index";
import {position} from "./interface";
import {FCB} from "../FCB/FCB";
import {decreaseDiskSpace} from "../utils/diskUtils";
import {getCurrentFreeBlocksIndexAndNumber, setViewsOne, valuesPointer} from "../positionViews/viewsUtils";


/**
 * 创建指令
 */
export let create = function (file_name: string, config: {
    content?: string,
    fileType: file_type
    recentWriterTime?: string,
    recentReadTime?: string,
}): void {
    //获取第一块空闲区域，包含了空闲盘块的行和列信息。
    const freeRegion: position | boolean = views.getFirstFreesRegion()

    if (typeof freeRegion !== "boolean") {
        //获取文件的大小
        const size = config.content ? getFileSize(config.fileType, config.content)
            : getFileSize(config.fileType)

        //创建一个FCB
        const fcb: FCB = initFCB(file_name, config, freeRegion, size);

        //改变磁盘的盘块的指针信息
        setDiscBlock(freeRegion, fcb);

        //改变磁盘空间
        if (!decreaseDiskSpace(size)) {
            throw new Error('磁盘空间不够用');
        }
    } else {
        console.log('磁盘空间已经满了');
    }
}

/**
 * 改变磁盘的盘块的指针信息
 * @desc 这里要做几件事情。第一：要判断出这个文件会占用多少空间直接影响到它需要多少个盘块
 * 第二：要把位示图中所占用的盘块数值全部置为1
 * 第三：要设置好盘块下一个盘块的指针的值
 */
function setDiscBlock(freeRegion: position | boolean, fcb: FCB) {
    if (typeof freeRegion === "boolean") {
        return
    }

    //获得文件的大小
    const file_size = fcb.size;
    //文件会占用的盘区的数目
    const occupy_number = Math.ceil(file_size / discBlockSize);
    //寻找有没有这么多的盘块数目，获取当前空闲盘块数目和下标,得到的是物理块号数组
    const free_blocks = getCurrentFreeBlocksIndexAndNumber(occupy_number);

    if(typeof free_blocks !== 'boolean') {
        //开始初始化这个盘块的信息和位示图置为1
        setViewsOne(free_blocks);
        //盘块的下一个指针赋值
        if (!valuesPointer(free_blocks)) {
            throw new Error('赋值异常，某个盘块已经被占用了')
        }

    } else {
        console.log('当前空间不足够')
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
