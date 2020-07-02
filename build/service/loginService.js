"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDao_1 = require("../dao/userDao");
const resultBean_1 = require("../utils/resultBean");
const core_1 = require("../core");
class loginService {
    static loginDeal(username, password, cb) {
        let dao = new userDao_1.UserDao();
        dao.selectSql().then(res => {
            const results = JSON.parse(JSON.stringify(res));
            const resultBean = new resultBean_1.ResultBean();
            for (let i = 0; i < results.length; i++) {
                //登陆成功
                if (username === results[i].username &&
                    password === results[i].password) {
                    // @ts-ignore
                    core_1.currentUser = username;
                    if (cb) {
                        try {
                            cb(resultBean.successBean('登陆成功', {
                                username: core_1.currentUser
                            }));
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                    return;
                }
            }
            if (cb) {
                try {
                    cb(resultBean.failBean('没有这个账户'));
                }
                catch (e) {
                    console.log(e);
                }
            }
            return;
        });
    }
    static registerDeal() {
    }
}
exports.loginService = loginService;
