import {file_type} from "../index";
import {FCB} from "../FCB/FCB";

export interface position {
    columns: number,
    rows: number
}

export interface config {
    //告诉系统你在哪一个目录下创建的文件
    path: string,
    content?: string,
    fileType: file_type
    recentWriterTime?: string,
    recentReadTime?: string,
}

export interface queryFilesFormat {
    path: string,
    files: Array<FCB>,
    user: string
}
