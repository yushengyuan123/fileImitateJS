import {FCB} from "../FCB/FCB";

/**
 * 目录块数据结构
 */
class Catalogue {
    //路径
    public path: string;

    //父结点目录指针
    public parent: Catalogue;

    //子代目录结点指针
    public child: Array<Catalogue>;

    //文件列表
    public files_list: Array<FCB>
}

