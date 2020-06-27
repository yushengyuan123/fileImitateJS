import {views} from "./positionViews";
import {position} from "../operation/interface";
import {discMemory} from "../disc/disc";

/**
 * 获取当前空闲盘块数目和下标
 */
export function getCurrentFreeBlocksIndexAndNumber(occupy_number: number): Array<number> | boolean{
    const freeBlocks: Array<number> = []

    for (let i = 0; i < occupy_number; i++) {
        const rows_columns: position | boolean = views.getFirstFreesRegion();
        if (typeof rows_columns !== "boolean") {
            freeBlocks[i] = views.transformIndex(rows_columns.columns, rows_columns.rows)
        }
    }
    //如果长度不相等的话，说明空间分配已经不够用了
    if (freeBlocks.length !== occupy_number) {
        return false
    }

    return freeBlocks
}

/**
 * 位示图置为1
 */
export function setViewsOne(indexArray: Array<number>): void {
    for (let i = 0; i < indexArray.length; i++) {
        const rowsInfo = views.transformRows(indexArray[i])
        views.setHasUsed(rowsInfo.columns, rowsInfo.rows)
    }
}

/**
 * 给盘区的下一块指针赋值,参数是所占用磁盘的物理块号数组
 * @param indexArray
 */
export function valuesPointer(indexArray: Array<number>): boolean{
    for (let i = 0; i < indexArray.length - 1; i++) {
        const index = indexArray[i]
        if (discMemory.discBlocks[index].nextIndex === null) {
            discMemory.discBlocks[index].nextIndex = indexArray[i + 1]
        } else {
            return false
        }
    }
    return true
}
