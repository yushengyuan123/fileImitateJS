"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const catalogueUtil_1 = require("../catalogue/catalogueUtil");
const userCatalogue_1 = require("../catalogue/userCatalogue");
/**
 * 根据文件路径进行查询
 */
function queryFiles(path) {
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
    const files_list = [];
    //todo 这里文件内容没有返回成功
    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        files_list.push({
            file_name: list[i].file_name,
            size: list[i].size,
            content: list[i].content,
            file_type: list[i].type
        });
    }
    return {
        path: temp.path,
        files: files_list,
        user: temp.user,
    };
}
exports.queryFiles = queryFiles;
/**
 * 进入用户选定文件的上一级目录
 */
function entryCatalogue(path) {
    //当前用户
    const user = index_1.currentUser;
    //多少层的目录
    const layer = path.split('/');
    //用户目录所在位置的下标
    let index = null;
    let temp;
    catalogueUtil_1.removeNone(layer);
    for (let i = 0; i < userCatalogue_1.UserRoot.length; i++) {
        if (userCatalogue_1.UserRoot[i].user === user) {
            index = i;
            break;
        }
    }
    temp = userCatalogue_1.UserRoot[index];
    return temp;
}
exports.entryCatalogue = entryCatalogue;
