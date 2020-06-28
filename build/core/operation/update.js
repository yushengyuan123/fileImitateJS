"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const catalogueUtil_1 = require("../catalogue/catalogueUtil");
const userCatalogue_1 = require("../catalogue/userCatalogue");
const verify_1 = require("../utils/verify");
/**
 * 更新文件操作
 * 这里要更新几个东西第一个当内容更新的时候对应的磁盘位示图可能要变，磁盘分区可能会有所增加。
 * FCB信息需要改变
 */
function updateFiles(name, beforeName, path) {
    //新名字和旧的名字一样就不用检验了
    if (beforeName === name) {
        return;
    }
    //todo 假如文件中有/，我肯定出bug
    verify_1.Verify.pathIsTheSame(path, name);
    updateFolder(name, beforeName, path);
}
exports.updateFiles = updateFiles;
/**
 * 更新文件夹
 * 文件名字改了，注意同时路径最后的名字也要改
 * @param name
 * @param path
 * @param beforeName
 */
function updateFolder(name, beforeName, path) {
    //当前用户
    const user = index_1.currentUser;
    //多少层的目录
    const layer = path.split('/');
    //用户目录所在位置的下标
    let index = null;
    let temp;
    let matchStr = '';
    catalogueUtil_1.removeNone(layer);
    for (let i = 0; i < userCatalogue_1.UserRoot.length; i++) {
        if (userCatalogue_1.UserRoot[i].user === user) {
            index = i;
            break;
        }
    }
    temp = userCatalogue_1.UserRoot[index];
    //寻找创建文件的目录
    for (let i = 0; i < layer.length - 1; i++) {
        matchStr += '/' + layer[i];
        for (let j = 0; j < temp.child.length; j++) {
            //路径命中
            if (matchStr === temp.child[j].path) {
                temp = temp.child[j];
                break;
            }
        }
    }
    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        if (list[i].file_name === beforeName) {
            //更新名字
            list[i].file_name = name;
            break;
        }
    }
    //更新路径
    for (let i = 0, list = temp.child; i < list.length; i++) {
        if (list[i].path === path) {
            //提取字符,如/hi,则结果为:/，假如/hi/nihao,则结果为/hi/
            list[i].path = path.substring(0, path.lastIndexOf('/') + 1) + name;
            break;
        }
    }
}
exports.updateFolder = updateFolder;
