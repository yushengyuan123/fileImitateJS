import {Catalogue} from "../catalogue/catalogue";
import {entryCatalogue, getCatalogueFCB} from "../utils/otherUtils";
import {FCB} from "../FCB/FCB";
import {discMemory} from "../disc/disc";
import {DiscBlock} from "../disc/discBlock";
import {views} from "../positionViews/positionViews";
import {position} from "./interface";
import {discSize, file_type} from "../index";
import {UserRoot} from "../catalogue/userCatalogue";

/**
 * 删除文件操作
 * 删除操作要从位示图移除，从磁盘分区移除, 还要把disc的磁盘分区指针指null
 * @param path
 * @param name
 * @param type
 */

export function deleteFiles(path: string, name: string, type: file_type) {
    const deleteCatalogue: Catalogue = entryCatalogue(path);
    let deleteFCB: FCB;
    let deleteSize: number
    let cacheCatalogue: Catalogue;

    //进入到需要删除的目录
    for(let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
        let newPath
        if (path === '/') {
            newPath = path + name
        } else {
            newPath = path + '/' + name
        }
        if (list[i].path === newPath) {
            cacheCatalogue = list[i]
        }
    }

    //这里还要注意假如删除的是文件夹，那么还要移除catalogue数组，如果只是txt则不需要
    for (let i = 0, list = deleteCatalogue.files_list; i < list.length; i++) {
        if (name === list[i].file_name) {
            deleteSize = list[i].size
            deleteFCB = list[i];
            break
        }
    }

    //删除文件夹，和删除txt文件处理是不一样的
    if (type === file_type.txt) {
        //断开磁盘的nextIndex指针
        removeFromDisc(deleteFCB)
        //将位示图置为0， 顺便把next指针置为null
        removeFromViews(deleteFCB);
    }

    //向上减少文件夹的大小
    decreaseUpCatalogue(deleteCatalogue, deleteSize)

    //释放磁盘空间的大小
    freeDiscSpace(deleteSize)

    //从FCB移除
    let index: number = deleteCatalogue.files_list.indexOf(deleteFCB);
    if (index > -1) {
        deleteCatalogue.files_list.splice(index, 1);
    }

    if (type === file_type.folder) {
        let concatPath
        //假如是文件夹从catalogueList下移除, 从目录数据结构的path路径区匹配
        if (path === '/') {
            concatPath = path + name
        } else {
            concatPath = path + '/' + name;
        }
        for (let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
            if (list[i].path === concatPath) {
                cacheCatalogue = list[i]
                let index: number = list.indexOf(list[i]);
                if (index > -1) {
                    list.splice(index, 1);
                }
                break
            }
        }

        removeViewsAsFolder(cacheCatalogue)
    }

}

/**
 * 删除完文件后释放磁盘空间的大小
 */
function freeDiscSpace(deleteSize: number) {
    if (discSize >= deleteSize) {
        // @ts-ignore
        discSize += deleteSize
    } else {
        throw new Error('删除空间大于磁盘空间， 磁盘大小分配错误')
    }
}

/**
 * 断开磁盘下和该文件相关的nextIndex指针
 * 删除txt则直接寻找就好了，但是假如删除的是folder你要逐级向下寻找所有的txt
 */
export function removeFromDisc(needUpdateFCB: FCB) {
    //获得删除FCB第一块磁盘的物理地址
    let firstIndex: number = needUpdateFCB.physical_position;
    //获得该盘曲
    let firstDisc: DiscBlock = discMemory.getOneDiscBlocksInfo(firstIndex)

    let temp: DiscBlock;

    for (let i = 0; i < needUpdateFCB.occupy_number - 1; i++) {
        temp = discMemory.getOneDiscBlocksInfo(firstDisc.nextIndex)
        if (firstDisc.nextIndex !== null) {
            firstDisc.nextIndex = null
        } else {
            throw new Error('移除指针发生异常，指针原来就是空的')
        }
        firstDisc = temp
    }
}

/**
 * 删除文件夹子后，对应文件夹下所有的txt都要从磁盘移除
 */
export function removeViewsAsFolder(deleteCatalogue: Catalogue) {
    if (deleteCatalogue.child.length !== 0) {
        for (let i = 0, list = deleteCatalogue.child; i < list.length; i++) {
            removeViewsAsFolder(list[i])
        }
    }

    const files: Array<FCB> = deleteCatalogue.files_list

    if (files.length !== 0) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].type === file_type.txt) {
                removeFromViews(files[i])
                removeFromDisc(files[i])
            }
        }
    }
}

/**
 * 改变上级目录所有的内存占用
 */
export function decreaseUpCatalogue(deleteCatalogue: Catalogue, size: number) {
    //如果修改的已经是根目录那就不用向上递归修改了
    if (deleteCatalogue.parent === null) {
        return
    }
    //获取上一级目录的名称
    let name = deleteCatalogue.path.substring(deleteCatalogue.path.lastIndexOf('/') + 1)
    if (name === '') {
        name = '/'
    }
    recursiveDelete(size, deleteCatalogue.parent, name)
}

/**
 * 递归减少folder文件的大小
 */
export function recursiveDelete(decreaseSize: number, catalogue: Catalogue, name: string) {
    if (catalogue === null) {
        return
    } else {
        //获取上一级目录的名称
        let child_name = catalogue.path.substring(catalogue.path.lastIndexOf('/') + 1)
        if (child_name === '') {
            child_name = '/'
        }
        recursiveDelete(decreaseSize, catalogue.parent, child_name)
        const fcb = getCatalogueFCB(catalogue, name)
        fcb.size -= decreaseSize
    }
}

/**
 * 从位示图去除
 */
export function removeFromViews(deleteFCB: FCB) {
    //要知道他在位示图哪一个位置，就必须知道所占用的外存盘块号
    //从fcb的起始盘块号码和占用盘块数量得知占用的盘块号码再结合盘块的next指针把整一条链子找出来
    const index: number = deleteFCB.physical_position;
    const occupy_number: number = deleteFCB.occupy_number;

    //在磁盘中查询对应的盘块好码,这个是起始盘块的物理位置
    let target_blocks: DiscBlock = discMemory.getOneDiscBlocksInfo(index);
    //收集这些这个文件所用的物理盘块号，形成一个数组
    const collectIndex: Array<number> = [];

    let temp: number

    for (let i = 0; i < occupy_number; i++) {
        collectIndex.push(target_blocks.index);
        temp = target_blocks.nextIndex;
        target_blocks.nextIndex = null;
        target_blocks = discMemory.getOneDiscBlocksInfo(temp);
    }

    collectIndex.forEach((value) => {
        const columns_rows: position = views.transformRows(value);
        if (!views.removeUsed(columns_rows.columns, columns_rows.rows)) {
            throw new Error('出现异常，有空间已经被占用')
        }
    })

}

