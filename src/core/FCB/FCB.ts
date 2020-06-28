/**'
 * FCB数据结构
 * @desc 假如用户创建的是文件夹，则大小固定，假如用户创建的是txt文件大小看字数
 */
import {file_type} from "../index";

export class FCB {
    //文件名字
    private _file_name: string;

    //外存的存储的起始盘块号
    private _physical_position: number;

    //占用的盘块数
    private _occupy_number: number;

    //文件大小
    private _size: number;

    //文件内容
    private _content: string = "";

    //文件类型，是文件夹还是txt文件
    private _type: file_type;

    // 最近写文件的时间
    private _recentlyWriteTime: string;

    // 最近读文件的时间
    private _recentlyReadTime: string;

    constructor() {}

    get recentlyReadTime(): string {
        return this._recentlyReadTime;
    }

    set recentlyReadTime(value: string) {
        this._recentlyReadTime = value;
    }

    get recentlyWriteTime(): string {
        return this._recentlyWriteTime;
    }

    set recentlyWriteTime(value: string) {
        this._recentlyWriteTime = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get occupy_number(): number {
        return this._occupy_number;
    }

    set occupy_number(value: number) {
        this._occupy_number = value;
    }

    get physical_position(): number {
        return this._physical_position;
    }

    set physical_position(value: number) {
        this._physical_position = value;
    }

    get file_name(): string {
        return this._file_name;
    }

    set file_name(value: string) {
        this._file_name = value;
    }

    get type(): file_type {
        return this._type;
    }

    set type(value: file_type) {
        this._type = value;
    }
}
