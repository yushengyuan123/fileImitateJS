import {file_type} from "../index";
import {Catalogue} from "../catalogue/catalogue";
import {Verify} from "../utils/verify";
import {entryCatalogue} from "../utils/otherUtils";

/**
 * 更新文件操作
 * 这里要更新几个东西第一个当内容更新的时候对应的磁盘位示图可能要变，磁盘分区可能会有所增加。
 * FCB信息需要改变
 */
export function updateFiles(
    name: string,
    beforeName: string,
    path: string,
    time: string,
    type: file_type
): void {
    //新名字和旧的名字一样就不用检验了
    if (beforeName === name) {
        return
    }

    //todo 假如文件中有/，我肯定出bug
    Verify.pathIsTheSame(path, name);

    updateFolder(name, beforeName, path, time, type);
}

/**
 * 更新文件夹
 * 文件名字改了，注意同时路径最后的名字也要改
 * @param name
 * @param path
 * @param beforeName
 * @param time
 * @param type
 */
export function updateFolder(
    name: string,
    beforeName: string,
    path: string,
    time: string,
    type: file_type
): void {
    const temp: Catalogue = entryCatalogue(path);

    //更新名字
    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        if (list[i].file_name === beforeName) {
            //更新名字
            list[i].file_name = name;
            list[i].recentlyWriteTime = time
            break
        }
    }

    //假如是文件夹则需要更新路径，否则不需要
    //而且这个路径更改整一个在目录下的文件路径全部都要改
    if (type === file_type.folder) {
        //记录下修改的目录结构
        let cache: Catalogue;
        let needModifyIndex: number;
        let newPath: string
        //更改了当前目录的
        for (let i = 0, list = temp.child; i < list.length; i++) {
            const old_name: string = list[i].path.substring(list[i].path.lastIndexOf('/') + 1);
            if (beforeName === old_name) {
                cache = list[i]
                needModifyIndex = cache.path.length
                list[i].path = newPath = list[i].path.substring(0, list[i].path.lastIndexOf('/') + 1) + name;
                break
            }
        }

        recursiveQuery(cache, needModifyIndex, newPath)
    }
}

/**
 * 文件递归查询修改
 */
export function recursiveQuery(target_catalogue: Catalogue, needModifyIndex: number, newPath: string) {
    const child: Array<Catalogue> = target_catalogue.child
    if (child.length === 0) {
        return
    } else {
        for (let i = 0; i < child.length; i++) {
            recursiveQuery(child[i], needModifyIndex, newPath);
            const pathStr: string = child[i].path
            child[i].path = newPath + pathStr.substring(needModifyIndex);
        }
    }
}
