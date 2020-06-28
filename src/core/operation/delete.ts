import {Catalogue} from "../catalogue/catalogue";
import {entryCatalogue} from "../utils/otherUtils";
import {FCB} from "../FCB/FCB";
import {discMemory} from "../disc/disc";
import {DiscBlock} from "../disc/discBlock";
import {views} from "../positionViews/positionViews";
import {position} from "./interface";
import {file_type} from "../index";
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

    //todo 还没有还原磁盘空间
    //这里还要注意假如删除的是文件夹，那么还要移除catalogue数组，如果只是txt则不需要
    for (let i = 0, list = deleteCatalogue.files_list; i < list.length; i++) {
        if (name === list[i].file_name) {
            deleteFCB = list[i];
            break
        }
    }

    //将位示图置为0， 顺便把next指针置为null
    removeFromViews(deleteFCB);

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
                let index: number = list.indexOf(list[i]);
                if (index > -1) {
                    list.splice(index, 1);
                }
                break
            }
        }
    }

    console.log(views.getViews())
    console.log(UserRoot)

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
        console.log(columns_rows)
        if (!views.removeUsed(columns_rows.columns, columns_rows.rows)) {
            throw new Error('出现异常，有空间已经被占用')
        }
    })

}

