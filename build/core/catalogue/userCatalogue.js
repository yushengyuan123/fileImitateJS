"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** 这里是维护所有注册用户的目录文件 **/
const catalogue_1 = require("./catalogue");
const userDao_1 = require("../../dao/userDao");
const utils_1 = require("../../utils/utils");
//todo 测试先这么写着把 以后删了
exports.UserRoot = [initRoot('15521064831')];
/**
 * 只要有用户注册了，就马上调用这个函数给用户加上一个根目录
 */
exports.initUserRoot = function () {
    let dao = new userDao_1.UserDao();
    dao.selectSql().then(res => {
        const results = utils_1.parseSqlResult(res);
        for (let i = 0; i < results.length; i++) {
            exports.UserRoot.push(initRoot(results.username));
        }
    });
};
/**
 * 用户注册增加目录
 */
function addRoot(username) {
    exports.UserRoot.push(initRoot(username));
}
/**
 * 初始化用户的更目录
 */
function initRoot(username) {
    const root = new catalogue_1.Catalogue();
    root.path = '/';
    root.user = username;
    return root;
}
