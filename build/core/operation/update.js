"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const verify_1 = require("../utils/verify");
const otherUtils_1 = require("../utils/otherUtils");
/**
 * 更新文件操作
 * 这里要更新几个东西第一个当内容更新的时候对应的磁盘位示图可能要变，磁盘分区可能会有所增加。
 * FCB信息需要改变
 */
function updateFiles(name, beforeName, path, time, type) {
    //新名字和旧的名字一样就不用检验了
    if (beforeName === name) {
        return;
    }
    //todo 假如文件中有/，我肯定出bug
    verify_1.Verify.pathIsTheSame(path, name);
    updateFolder(name, beforeName, path, time, type);
}
exports.updateFiles = updateFiles;
/**
 * 更新文件夹
 * 文件名字改了，注意同时路径最后的名字也要改
 * @param name
 * @param path
 * @param beforeName
 * @param time
 * @param type
 */
function updateFolder(name, beforeName, path, time, type) {
    const temp = otherUtils_1.entryCatalogue(path);
    //更新名字
    for (let i = 0, list = temp.files_list; i < list.length; i++) {
        if (list[i].file_name === beforeName) {
            //更新名字
            list[i].file_name = name;
            list[i].recentlyWriteTime = time;
            break;
        }
    }
    //假如是文件夹则需要更新路径，否则不需要
    //而且这个路径更改整一个在目录下的文件路径全部都要改
    if (type === index_1.file_type.folder) {
        //记录下修改的目录结构
        let cache;
        let needModifyIndex;
        let newPath;
        //更改了当前目录的
        for (let i = 0, list = temp.child; i < list.length; i++) {
            const old_name = list[i].path.substring(list[i].path.lastIndexOf('/') + 1);
            if (beforeName === old_name) {
                cache = list[i];
                needModifyIndex = cache.path.length;
                list[i].path = newPath = list[i].path.substring(0, list[i].path.lastIndexOf('/') + 1) + name;
                break;
            }
        }
        recursiveQuery(cache, needModifyIndex, newPath);
    }
}
exports.updateFolder = updateFolder;
/**
 * 文件递归查询修改
 */
function recursiveQuery(target_catalogue, needModifyIndex, newPath) {
    const child = target_catalogue.child;
    if (child.length === 0) {
        return;
    }
    else {
        for (let i = 0; i < child.length; i++) {
            recursiveQuery(child[i], needModifyIndex, newPath);
            const pathStr = child[i].path;
            child[i].path = newPath + pathStr.substring(needModifyIndex);
        }
    }
}
exports.recursiveQuery = recursiveQuery;
