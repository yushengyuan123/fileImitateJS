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
    console.log(userCatalogue_1.UserRoot);
    console.log('当前用户', user);
    for (let i = 0; i < userCatalogue_1.UserRoot.length; i++) {
        if (userCatalogue_1.UserRoot[i].user === user) {
            index = i;
            break;
        }
    }
    temp = userCatalogue_1.UserRoot[index];
    console.log('当前目录', temp);
    console.log('当前用户', user);
    if (path !== '/') {
        //现在更目录匹配一波
        //寻找创建文件的目录
        console.log(layer);
        for (let i = 0; i < layer.length; i++) {
            matchStr += '/' + layer[i];
            console.log('匹配路径', matchStr);
            for (let j = 0; j < temp.child.length; j++) {
                //路径命中
                console.log(temp.child[j]);
                if (matchStr === temp.child[j].path) {
                    temp = temp.child[j];
                    break;
                }
            }
        }
    }
    const files_list = [];
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
    let matchStr = '';
    catalogueUtil_1.removeNone(layer);
    for (let i = 0; i < userCatalogue_1.UserRoot.length; i++) {
        if (userCatalogue_1.UserRoot[i].user === user) {
            index = i;
            break;
        }
    }
    temp = userCatalogue_1.UserRoot[index];
    if (path !== '/') {
        //寻找创建文件的目录
        for (let i = 0; i < layer.length; i++) {
            matchStr += '/' + layer[i];
            for (let j = 0; j < temp.child.length; j++) {
                //路径命中
                if (matchStr === temp.child[j].path) {
                    temp = temp.child[j];
                    break;
                }
            }
        }
    }
    return temp;
}
exports.entryCatalogue = entryCatalogue;
/**
 * 获取某个用户根目录
 */
function getRootCatalogue() {
    //当前用户
    const user = index_1.currentUser;
    //用户目录所在位置的下标
    let index = null;
    let temp;
    for (let i = 0; i < userCatalogue_1.UserRoot.length; i++) {
        if (userCatalogue_1.UserRoot[i].user === user) {
            index = i;
            break;
        }
    }
    temp = userCatalogue_1.UserRoot[index];
    return temp;
}
exports.getRootCatalogue = getRootCatalogue;
/**
 * 获得本目录对应的目录FCB
 */
function getCatalogueFCB(catalogue, name) {
    // const name = catalogue.path.substring(catalogue.path.lastIndexOf('/') + 1)
    console.log('目录', catalogue);
    console.log('修改文件目录名称', name);
    for (let i = 0, list = catalogue.files_list; i < list.length; i++) {
        if (name === list[i].file_name) {
            return list[i];
        }
    }
    throw new Error('发生错误文件FCB和目录名称不匹配');
}
exports.getCatalogueFCB = getCatalogueFCB;
