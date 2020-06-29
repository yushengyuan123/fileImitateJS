import {currentUser} from "../index";
import {Catalogue} from "../catalogue/catalogue";
import {removeNone} from "../catalogue/catalogueUtil";
import {UserRoot} from "../catalogue/userCatalogue";
import {queryFilesFormat} from "../operation/interface";

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

    //寻找创建文件的目录
    for (let i = 0; i < layer.length - 1; i++) {
        matchStr += '/' + layer[i]
        for (let j = 0; j < temp.child.length; j++) {
            //路径命中
            if (matchStr === temp.child[j].path) {
                temp = temp.child[j];
                break
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

    removeNone(layer);

    for (let i = 0; i < UserRoot.length; i++) {
        if (UserRoot[i].user === user) {
            index = i;
            break
        }
    }

    temp = UserRoot[index];

    return temp;
}

