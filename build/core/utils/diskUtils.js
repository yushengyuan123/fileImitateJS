"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
/**
 * 减少硬盘存储空间
 */
function decreaseDiskSpace(size) {
    //看磁盘空间是否够减
    if (index_1.discSize >= size) {
        // @ts-ignore
        index_1.discSize = index_1.discSize - size;
        return true;
    }
    else {
        return false;
    }
}
exports.decreaseDiskSpace = decreaseDiskSpace;
/**
 * 释放磁盘空间
 */
function increaseDiskSpace(size) {
    if (index_1.discSize + size <= index_1.MAXSIZE) {
        // @ts-ignore
        index_1.discSize = index_1.discSize + size;
        return true;
    }
    else {
        return false;
    }
}
exports.increaseDiskSpace = increaseDiskSpace;
