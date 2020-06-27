"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionViews_1 = require("./positionViews");
const disc_1 = require("../disc/disc");
/**
 * 获取当前空闲盘块数目和下标
 */
function getCurrentFreeBlocksIndexAndNumber(occupy_number) {
    const freeBlocks = [];
    for (let i = 0; i < occupy_number; i++) {
        const rows_columns = positionViews_1.views.getFirstFreesRegion();
        if (typeof rows_columns !== "boolean") {
            freeBlocks[i] = positionViews_1.views.transformIndex(rows_columns.columns, rows_columns.rows);
        }
    }
    //如果长度不相等的话，说明空间分配已经不够用了
    if (freeBlocks.length !== occupy_number) {
        return false;
    }
    return freeBlocks;
}
exports.getCurrentFreeBlocksIndexAndNumber = getCurrentFreeBlocksIndexAndNumber;
/**
 * 位示图置为1
 */
function setViewsOne(indexArray) {
    for (let i = 0; i < indexArray.length; i++) {
        const rowsInfo = positionViews_1.views.transformRows(indexArray[i]);
        positionViews_1.views.setHasUsed(rowsInfo.columns, rowsInfo.rows);
    }
}
exports.setViewsOne = setViewsOne;
/**
 * 给盘区的下一块指针赋值,参数是所占用磁盘的物理块号数组
 * @param indexArray
 */
function valuesPointer(indexArray) {
    for (let i = 0; i < indexArray.length - 1; i++) {
        const index = indexArray[i];
        if (disc_1.discMemory.discBlocks[index].nextIndex === null) {
            disc_1.discMemory.discBlocks[index].nextIndex = indexArray[i + 1];
        }
        else {
            return false;
        }
    }
    return true;
}
exports.valuesPointer = valuesPointer;
