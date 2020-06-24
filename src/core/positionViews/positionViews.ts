/**
 * 位示图
 */
import {position} from "../operation/interface";

class PositionViews {
    private views: Array<any> = new Array<any>();

    //列
    private rows: number = 2;

    //行
    private columns: number = 10;

    constructor() {
        this.initViews()
    }

    private initViews(): void {
        for (let i = 0; i < this.columns; i++) {
            this.views[i] = []
            for (let j = 0; j < this.rows; j++) {
                this.views[i][j] = 0
            }
        }
    }

    /**
     * 获得第一块空闲的区域下标
     */
    public getFirstFreesRegion(): position | boolean{
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.views[i][j] === 0) {
                    return {
                        columns: i,
                        rows:j
                    }
                }
            }
        }
        //假如遍历结束说明磁盘分区已经满了无法再进行分配
        return false
    }

    //行列转位物理块号
    public transformIndex(columns: number, rows: number): number {
        return 10 * rows  + columns;
    }

    /**
     * 设置某个下标的区域已经使用
     */
    public setHasUsed(columns: number, rows: number): boolean {
        if (!this.views[columns][rows]) {
            this.views[columns][rows] = 1;
            return true
        } else {
            return false
        }
    }

    //获得为位示图
    public getViews(): void {
        console.log(this.views)
    }
}

//导出这片盘区
export let views = new PositionViews()

