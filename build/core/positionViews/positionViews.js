"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PositionViews {
    constructor() {
        this.views = new Array();
        //列
        this.rows = 2;
        //行
        this.columns = 10;
        this.initViews();
    }
    initViews() {
        for (let i = 0; i < this.columns; i++) {
            this.views[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.views[i][j] = 0;
            }
        }
    }
    /**
     * 获得第一块空闲的区域下标
     */
    getFirstFreesRegion() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.views[i][j] === 0) {
                    return {
                        columns: i,
                        rows: j
                    };
                }
            }
        }
        //假如遍历结束说明磁盘分区已经满了无法再进行分配
        return false;
    }
    //行列转位物理块号
    transformIndex(columns, rows) {
        return 10 * rows + columns;
    }
    /**
     * 设置某个下标的区域已经使用
     */
    setHasUsed(columns, rows) {
        if (!this.views[columns][rows]) {
            this.views[columns][rows] = 1;
            return true;
        }
        else {
            return false;
        }
    }
    //获得为位示图
    getViews() {
        console.log(this.views);
    }
}
//导出这片盘区
exports.views = new PositionViews();
