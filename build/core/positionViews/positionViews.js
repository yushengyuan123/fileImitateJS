"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PositionViews {
    constructor() {
        this.views = new Array();
        //一行拥有的数量
        this.rows_number = 10;
        //列.
        this.rows = 2;
        //行
        this.columns = 10;
        this.initViews();
    }
    initViews() {
        for (let i = 0; i < this.rows; i++) {
            this.views[i] = [];
            for (let j = 0; j < this.columns; j++) {
                this.views[i][j] = 0;
            }
        }
    }
    /**
     * 获得第一块空闲的区域下标
     */
    getFirstFreesRegion() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.views[i][j] === 0) {
                    return {
                        rows: i,
                        columns: j
                    };
                }
            }
        }
        //假如遍历结束说明磁盘分区已经满了无法再进行分配
        return false;
    }
    //行列转位物理块号
    transformIndex(columns, rows) {
        return this.rows_number * rows + columns;
    }
    //物理块号转为行列
    transformRows(index) {
        const rows = Math.floor(index / this.rows_number);
        const columns = index % this.rows_number;
        return {
            rows: rows,
            columns: columns
        };
    }
    /**
     * 设置某个下标的区域已经使用
     */
    setHasUsed(columns, rows) {
        if (!this.views[rows][columns]) {
            this.views[rows][columns] = 1;
            return true;
        }
        else {
            return false;
        }
    }
    //去除删除掉的文件
    removeUsed(columns, rows) {
        if (this.views[rows][columns]) {
            this.views[rows][columns] = 0;
            return true;
        }
        else {
            return false;
        }
    }
    //获得为位示图
    getViews() {
        return this.views;
    }
}
//导出这片盘区
exports.views = new PositionViews();
