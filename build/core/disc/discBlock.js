"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 盘块
 */
class DiscBlock {
    constructor() {
        //物理块号下标
        this.index = null;
        //下一块的指针,指向它的物理块号
        this.nextIndex = null;
    }
}
exports.DiscBlock = DiscBlock;
