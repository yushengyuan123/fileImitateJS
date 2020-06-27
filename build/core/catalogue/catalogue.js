"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 目录块数据结构
 */
class Catalogue {
    constructor() {
        //父结点目录指针
        this.parent = null;
        //子代目录结点指针,这个必须是创建folder才会有的东西
        this.child = new Array();
        /**
         * 文件列表,这个文件列表分为folder文件夹，和txt文件。假如用户创建了一个文件夹
         * 那么你就要去new Catalogue并子代目录结点指针赋值。假如是一个txt那么就不需要。
         */
        this.files_list = new Array();
    }
}
exports.Catalogue = Catalogue;
