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
import {decreaseDiskSpace, increaseDiskSpace} from "../utils/diskUtils";
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
    //新文本的空间
    let tempSize: number = 0;
    //旧的文本空间
    let oldSize: number = 0;

    let needUpdateFCB: FCB;

    //找出对应的FCB，更新内容, 同时更新内存占用情况
    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        if (list[i].file_name === name) {
            needUpdateFCB = list[i];
            //更新内容
            list[i].content = content;
            oldSize = list[i].size
            list[i].size = tempSize = getFileSize(file_type.txt, content);
            break
        }
    }

    //新文本和老文本的差值,
    let d_value = Math.abs(tempSize - oldSize);

    //更新磁盘占用情况
    //有两种情况，新的文本可能会更小，或者新的文本会更大，更小了则需要释放空间
    if (tempSize >= oldSize) {
        //同时还要更新磁盘的空间
        if (!decreaseDiskSpace(d_value)) {
            throw new Error('磁盘空间不足')
        }
        updateDiscSpace(d_value, oldSize, path, needUpdateFCB);
    } else {
        if (!increaseDiskSpace(d_value)) {
            throw new Error('磁盘空间不足')
        }
        freeSpace(d_value, oldSize, path, needUpdateFCB)
    }

    //更新完这个TXT的大小内容，接下来就要更新它所在上一级目录的内存占用情况。更目录除外
    if (path != '/') {
        let folder_name: string = temp.path.substring(path.lastIndexOf('/') + 1);
        let parent = temp.parent;
        //逐步更新文件目录的大小，一直更新到更目录
        while (parent !== null) {
            for (let i = 0, list = parent.files_list; i < list.length; i++) {
                if (list[i].file_name === folder_name) {
                    if (tempSize >= oldSize) {
                        list[i].size += d_value;
                    } else {
                        list[i].size -= d_value;
                    }
                    folder_name = list[i].file_name
                    break
                }
            }
            parent = parent.parent
        }
    }

    console.log(needUpdateFCB)
}

/**
 * 空间释放
 * @param d_value
 * @param oldSize
 * @param path
 * @param needUpdateFCB
 */
export function freeSpace(d_value: number, oldSize: number, path: string, needUpdateFCB: FCB) {
    //最后一块盘区占用的空间
    const lastDiscOccupySpace: number = oldSize - discBlockSize * (needUpdateFCB.occupy_number - 1)

    //进入if说明盘块用压缩
    if (d_value > lastDiscOccupySpace) {
        //除了压缩原来最后那一块，需要压缩的空间
        const rest: number = d_value - lastDiscOccupySpace
        //压缩的盘曲
        const shrink_number: number = Math.floor(rest / discBlockSize) + 1;//这个1代表原来最后的

        let firstIndex: number = needUpdateFCB.physical_position;

        let temp: DiscBlock = discMemory.getOneDiscBlocksInfo(firstIndex)

        for (let i = 0; i < needUpdateFCB.occupy_number - shrink_number - 1; i++) {
            firstIndex = temp.nextIndex
            temp = discMemory.getOneDiscBlocksInfo(firstIndex)
        }

        let next: DiscBlock
        //还原位置图
        for (let i = 0; i <= shrink_number; i++) {
            if (i !== 0) {
                const columns_rows = views.transformRows(temp.index);
                views.removeUsed(columns_rows.columns, columns_rows.rows)
            }
            if (i !== shrink_number) {
                next = discMemory.getOneDiscBlocksInfo(temp.nextIndex);
                //断开指针
                temp.nextIndex = null;
                temp = next
            }
        }
        //最后还要对FCB占用的磁盘块数目进行更新
        needUpdateFCB.occupy_number -= shrink_number
    }
}

/**
 * 更新磁盘外存放占用情况,占用外村增大了
 */
function updateDiscSpace(size: number, oldSize: number, path: string, needUpdateFCB: FCB) {
    let lastDiscBlock: DiscBlock = findLastDiscBlock(needUpdateFCB);

    //文件所对应最后一块盘块的占用剩余空间
    const restSize: number = discBlockSize * needUpdateFCB.occupy_number - oldSize;

    //新的空间在磁盘不够用，则需要新开辟一块空间
    if (restSize < size) {
        const need_number: number = Math.ceil((size - restSize) / discBlockSize);

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
        needUpdateFCB.occupy_number += need_number
    }
}

/**
 * 找出某一个起始盘曲对应的最后的盘曲
 * @param startFCB
 */
export function findLastDiscBlock(startFCB: FCB): DiscBlock {
    const index: number = startFCB.physical_position;
    const occupy_number: number = startFCB.occupy_number;

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
