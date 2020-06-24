"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDao_1 = require("../dao/userDao");
const resultBean_1 = require("../utils/resultBean");
class loginService {
    static loginDeal(username, password, cb) {
        let dao = new userDao_1.UserDao();
        dao.selectSql().then(res => {
            const results = JSON.stringify(JSON.parse(res));
            const resultBean = new resultBean_1.ResultBean();
            for (let i = 0; i < results.length; i++) {
                //登陆成功
                if (username === res[i].username &&
                    password === res[i].password) {
                    if (cb) {
                        try {
                            cb(resultBean.successBean('登陆成功'));
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
