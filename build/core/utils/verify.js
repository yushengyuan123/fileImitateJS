"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otherUtils_1 = require("./otherUtils");
class Verify {
    //路径校验是否相同
    static pathIsTheSame(path, name) {
        console.log(path);
        //进入所选目录的上一级目录
        const upLevel = otherUtils_1.entryCatalogue(path);
        console.log(upLevel);
        for (let i = 0, list = upLevel.files_list; i < list.length; i++) {
            if (list[i].file_name === name) {
                throw new Error('修改失败,本目录的路径有重名');
            }
        }
    }
}
exports.Verify = Verify;
