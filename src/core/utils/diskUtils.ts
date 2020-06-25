import {discSize, MAXSIZE} from "../index";

/**
 * 减少硬盘存储空间
 */
export function decreaseDiskSpace(size: number): boolean {
    //看磁盘空间是否够减
    if (discSize >= size) {
        // @ts-ignore
        discSize = discSize - size
        return true
    } else {
        return false
    }

}

/**
 * 释放磁盘空间
 */
export function increaseDiskSpace(size: number): boolean {
    if (discSize + size <= MAXSIZE) {
        // @ts-ignore
        discSize = discSize + size
        return true
    } else {
        return false
    }
}



