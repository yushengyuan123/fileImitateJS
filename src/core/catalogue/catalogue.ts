import {FCB} from "../FCB/FCB";

/**
 * 目录块数据结构
 */
class Catalogue {
    //路径
    public path: string;

    //所属用户
    public user: string;

    //父结点目录指针
    public parent: Catalogue = null;

    //子代目录结点指针
    public child: Array<Catalogue> = null;

    /**
     * 文件列表,这个文件列表分为folder文件夹，和txt文件。假如用户创建了一个文件夹
     * 那么你就要去new Catalogue并子代目录结点指针赋值。假如是一个txt那么就不需要。
     */
    public files_list: Array<FCB>
}

