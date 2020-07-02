"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 当前使用的用户的username
 */
exports.currentUser = '';
/**
 * 用户当前目录
 */
exports.currentCatalogue = '/';
/**
 * MB单位
 */
exports.MB = 1024;
/**
 * 磁盘最大空间
 */
exports.MAXSIZE = 10 * exports.MB;
/**
 * 磁盘空间
 */
exports.discSize = 10 * exports.MB;
/**
 * 每一块的大小
 */
exports.discBlockSize = 512;
/**
 * 磁盘的块数
 */
exports.discBlock_number = exports.discSize / exports.discBlockSize;
/**
 * 规定一个folder是256字节
 */
exports.folderSize = 0;
/**
 * 规定一个文字是8个字节
 */
exports.fontSize = 8;
/**
 * 定义文件类型，txt还是folder
 */
var file_type;
(function (file_type) {
    file_type[file_type["folder"] = 0] = "folder";
    file_type[file_type["txt"] = 1] = "txt";
})(file_type = exports.file_type || (exports.file_type = {}));
var operation_muster;
(function (operation_muster) {
    operation_muster[operation_muster["crete"] = 0] = "crete";
    operation_muster[operation_muster["update"] = 1] = "update";
    operation_muster[operation_muster["delete"] = 2] = "delete";
})(operation_muster = exports.operation_muster || (exports.operation_muster = {}));
