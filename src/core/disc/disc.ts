import {DiscBlock} from "./discBlock";
import {discBlock_number} from "../index";

/**
 * 虚拟磁盘外存
 */
class Disc {
    //盘块数组，存放所有的盘块
    public discBlocks: Array<DiscBlock>;

    constructor() {
        this.initBlocks();
    }

    //初始化盘区
    private initBlocks(): void {
        for (let i = 0; i < discBlock_number; i++) {
            //初始化这个盘块
            this.discBlocks[i] = new DiscBlock();
            //记录这个盘块的下标
            this.discBlocks[i].index = i;
        }
    }

    //获得这个盘块的信息
    public getDiscBlocks(): Array<DiscBlock>{
        return this.discBlocks
    }
}

//导出这个磁盘空间
export const discMemory = new Disc();



