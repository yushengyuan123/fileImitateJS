import {currentUser, file_type, operation_muster} from "../index";
import {Catalogue} from "../catalogue/catalogue";
import {removeNone} from "../catalogue/catalogueUtil";
import {UserRoot} from "../catalogue/userCatalogue";
import {Verify} from "../utils/verify";

/**
 * 更新文件操作
 * 这里要更新几个东西第一个当内容更新的时候对应的磁盘位示图可能要变，磁盘分区可能会有所增加。
 * FCB信息需要改变
 */
export function updateFiles(
    name: string,
    beforeName: string,
    path: string,
    content: string,
    type: file_type
): void {
    //新名字和旧的名字一样就不用检验了
    if (beforeName === name) {
        return
    }
    //todo 假如文件中有/，我肯定出bug
    Verify.pathIsTheSame(path, name);

    if (type === file_type.folder) {
        //当只是文件夹的时候指用更新名字就可以了
        updateFolder(name, beforeName, path);
    } else if (type === file_type.txt) {
        //todo txt文件的修改
    }

}

/**
 * 更新文件夹
 * 文件名字改了，注意同时路径最后的名字也要改
 * @param name
 * @param path
 * @param beforeName
 */
export function updateFolder(
    name: string,
    beforeName: string,
    path: string,
): void {
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

    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        if (list[i].file_name === beforeName) {
            //更新名字。同时也要更新路径
            list[i].file_name = name
            break
        }
    }

    for (let i = 0, list = temp.child; i < list.length; i++) {
        if (list[i].path === path) {
            //提取字符,如/hi,则结果为:/，假如/hi/nihao,则结果为/hi/
            list[i].path = path.substring(0, path.lastIndexOf('/') + 1) + name;
            break
        }
    }
}
