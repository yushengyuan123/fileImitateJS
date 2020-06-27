"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discBlock_1 = require("./discBlock");
const index_1 = require("../index");
/**
 * 虚拟磁盘外存
 */
class Disc {
    constructor() {
        this.discBlocks = new Array();
        this.initBlocks();
    }
    //初始化盘区
    initBlocks() {
        for (let i = 0; i < index_1.discBlock_number; i++) {
            //初始化这个盘块
            this.discBlocks[i] = new discBlock_1.DiscBlock();
            //记录这个盘块的下标
            this.discBlocks[i].index = i;
        }
    }
    //获取某一个物理盘块的信息
    getOneDiscBlocksInfo(index) {
        return this.discBlocks[index];
    }
    //获得这个盘块的信息
    getDiscBlocks() {
        return this.discBlocks;
    }
}
//导出这个磁盘空间
exports.discMemory = new Disc();
