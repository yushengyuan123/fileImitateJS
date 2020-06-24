"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.folderSize = 256;
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
