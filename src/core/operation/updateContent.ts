/**
 * 更新文件内容
 * @param name
 * @param path
 * @param content
 * @param beforeContent
 */
import {Catalogue} from "../catalogue/catalogue";
import {entryCatalogue} from "../utils/otherUtils";
import {getFileSize} from "./create";
import {discBlockSize, file_type} from "../index";
import {decreaseDiskSpace} from "../utils/diskUtils";
import {FCB} from "../FCB/FCB";
import {DiscBlock} from "../disc/discBlock";
import {discMemory} from "../disc/disc";
import {position} from "./interface";
import {views} from "../positionViews/positionViews";

export function updateFilesContent(
    name: string, path: string, content: string, beforeContent: string) {

    //新内容和旧的内容一样就不用检验了
    if (beforeContent === content) {
        return
    }

    startUpdate(path, name, content)
}

/**
 * 注意更新txt内容和更新名字不一样，第一：更新FCB上的内容，
 * 第二：刷新文件的占用空间，第三：最重要改变外存的占用情况
 * @param path
 * @param name
 * @param content
 */
export function startUpdate(path: string, name: string, content) {
    const temp: Catalogue = entryCatalogue(path);

    let tempSize: number = 0;

    let beforeSize: number = 0;

    let needUpdateFCB: FCB;

    //找出对应的FCB，更新内容, 同时更新内存占用情况
    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        if (list[i].file_name === name) {
            needUpdateFCB = list[i];
            //更新内容
            list[i].content = content;
            list[i].size = tempSize = getFileSize(file_type.txt, content);
            break
        }
    }

    //同时还要更新磁盘的空间
    if (!decreaseDiskSpace(tempSize)) {
        throw new Error('磁盘空间不足')
    }

    //更新完这个TXT的大小内容，接下来就要更新它所在上一级目录的内存占用情况。更目录除外
    if (path != '/') {
        const folder_name: string = temp.path.substring(path.lastIndexOf('/') + 1)
        const parent = temp.parent;

        for (let i = 0, list = parent.files_list; i < list.length; i++) {
            if (list[i].file_name === folder_name) {
                beforeSize = list[i].size
                list[i].size += tempSize;
                break
            }
        }
    }

    //更新磁盘占用情况
    updateDiscSpace(tempSize, beforeSize, path, needUpdateFCB);
}

/**
 * 更新磁盘外存放占用情况
 */
function updateDiscSpace(size: number, beforeSize: number, path: string, needUpdateFCB: FCB) {
    const newSize = size + beforeSize;

    let lastDiscBlock: DiscBlock = findLastDiscBlock(needUpdateFCB);

    //文件所对应最后一块盘块的占用剩余空间
    const restSize: number = discBlockSize * needUpdateFCB.occupy_number - size;

    //新的空间在磁盘不够用，则需要新开辟一块空间
    //todo 假如文件变小了 你还要释放空间
    if (restSize < newSize) {
        const need_number: number = Math.ceil((newSize - restSize) / discBlockSize);

        for (let i = 0; i < need_number; i++) {
            let freePosition = views.getFirstFreesRegion();
            if (typeof freePosition !== "boolean") {
                views.setHasUsed(freePosition.columns, freePosition.rows)
                lastDiscBlock.nextIndex = views.transformIndex(freePosition.columns, freePosition.rows)
                lastDiscBlock = discMemory.getOneDiscBlocksInfo(lastDiscBlock.nextIndex)
            } else {
                throw new Error('磁盘空间不充足')
            }
        }

        //最后还要对FCB占用的磁盘块数目进行更新
        needUpdateFCB.occupy_number = need_number
    }
}

/**
 * 找出某一个起始盘曲对应的最后的盘曲
 * @param startFCB
 */
export function findLastDiscBlock(startFCB: FCB): DiscBlock {
    const index: number = startFCB.physical_position;
    const occupy_number: number = startFCB.occupy_number;

    console.log('FCB',startFCB)
    console.log('我进入了')

    //在磁盘中查询对应的盘块好码,这个是起始盘块的物理位置
    let target_blocks: DiscBlock = discMemory.getOneDiscBlocksInfo(index);

    if (occupy_number === 1) {
        console.log(index)
        return discMemory.getOneDiscBlocksInfo(index);
    } else {
        let temp: number;
        for (let i = 0; i < occupy_number - 1; i++) {
            temp = target_blocks.nextIndex;
            console.log(temp)
        }
        return discMemory.getOneDiscBlocksInfo(temp);
    }
}
