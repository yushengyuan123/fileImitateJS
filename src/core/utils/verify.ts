/**
 * 各种校验的工具类
 */
import {Catalogue} from "../catalogue/catalogue";
import {entryCatalogue} from "./otherUtils";
import {operation_muster} from "../index";

export class Verify {
    //路径校验是否相同
    public static pathIsTheSame(path: string, name: string): any {
        console.log(path)
        //进入所选目录的上一级目录
        const upLevel: Catalogue = entryCatalogue(path)

        console.log(upLevel)

        for (let i = 0, list = upLevel.files_list; i < list.length; i++) {
            if (list[i].file_name === name) {
                throw new Error('修改失败,本目录的路径有重名')
            }
        }
    }
}
