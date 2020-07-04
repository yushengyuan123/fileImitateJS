"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FCB {
    constructor() {
        //文件内容
        this._content = "";
    }
    get recentlyReadTime() {
        return this._recentlyReadTime;
    }
    set recentlyReadTime(value) {
        this._recentlyReadTime = value;
    }
    get recentlyWriteTime() {
        return this._recentlyWriteTime;
    }
    set recentlyWriteTime(value) {
        this._recentlyWriteTime = value;
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }
    get occupy_number() {
        return this._occupy_number;
    }
    set occupy_number(value) {
        this._occupy_number = value;
    }
    get physical_position() {
        return this._physical_position;
    }
    set physical_position(value) {
        this._physical_position = value;
    }
    get file_name() {
        return this._file_name;
    }
    set file_name(value) {
        this._file_name = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get createTime() {
        return this._createTime;
    }
    set createTime(value) {
        this._createTime = value;
    }
}
exports.FCB = FCB;
