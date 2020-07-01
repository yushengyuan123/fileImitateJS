import {currentUser} from "../index";
import {Catalogue} from "../catalogue/catalogue";
import {removeNone} from "../catalogue/catalogueUtil";
import {UserRoot} from "../catalogue/userCatalogue";
import {queryFilesFormat} from "../operation/interface";
import {FCB} from "../FCB/FCB";

/**
 * 根据文件路径进行查询
 */
export function queryFiles(path: string): queryFilesFormat {
    //当前用户
    const user: string = currentUser;
    //多少层的目录
    const layer: Array<any> = path.split('/');
    //用户目录所在位置的下标
    let index: number = null;
    let temp: Catalogue;
    let matchStr: string = '';

    removeNone(layer);

    for (let i = 0; i < UserRoot.length; i++) {
        if (UserRoot[i].user === user) {
            index = i;
            break
        }
    }

    temp = UserRoot[index];

    if (path !== '/') {
        //现在更目录匹配一波
        //寻找创建文件的目录
        console.log(layer)
        for (let i = 0; i < layer.length; i++) {
            matchStr += '/' + layer[i];
            console.log('匹配路径', matchStr)
            for (let j = 0; j < temp.child.length; j++) {
                //路径命中
                console.log(temp.child[j])
                if (matchStr === temp.child[j].path) {
                    temp = temp.child[j];
                    break
                }
            }
        }
    }

    const files_list: Array<any> = []

    for(let i = 0, list = temp.files_list; i < list.length; i++) {
        files_list.push({
            file_name: list[i].file_name,
            size: list[i].size,
            content: list[i].content,
            file_type: list[i].type
        })
    }

    return {
        path: temp.path,
        files: files_list,
        user: temp.user,
    }
}

/**
 * 进入用户选定文件的上一级目录
 */
export function entryCatalogue(path: string): Catalogue {
    //当前用户
    const user: string = currentUser;
    //多少层的目录
    const layer: Array<any> = path.split('/');
    //用户目录所在位置的下标
    let index: number = null;
    let temp: Catalogue;
    let matchStr: string = ''

    removeNone(layer);

    for (let i = 0; i < UserRoot.length; i++) {
        if (UserRoot[i].user === user) {
            index = i;
            break
        }
    }

    temp = UserRoot[index];

    if (path !== '/') {
        //寻找创建文件的目录
        for (let i = 0; i < layer.length; i++) {
            matchStr += '/' + layer[i]
            for (let j = 0; j < temp.child.length; j++) {
                //路径命中
                if (matchStr === temp.child[j].path) {
                    temp = temp.child[j];
                    break
                }
            }
        }
    }

    return temp;
}

/**
 * 获取某个用户根目录
 */
export function getRootCatalogue(): Catalogue {
    //当前用户
    const user: string = currentUser;
    //用户目录所在位置的下标
    let index: number = null;
    let temp: Catalogue;

    for (let i = 0; i < UserRoot.length; i++) {
        if (UserRoot[i].user === user) {
            index = i;
            break
        }
    }

    temp = UserRoot[index];

    return temp
}

/**
 * 获得本目录对应的目录FCB
 */
export function getCatalogueFCB(catalogue: Catalogue): FCB {
    const name = catalogue.path.substring(catalogue.path.lastIndexOf('/') + 1)
    for (let i = 0, list =  catalogue.files_list; i < list.length; i++) {
        if (name === list[i].file_name) {
            return list[i]
        }
    }
    throw new Error('发生错误文件FCB和目录名称不匹配')
}

