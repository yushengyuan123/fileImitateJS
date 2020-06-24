"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginService_1 = require("../service/loginService");
/**
 * 用户登陆注册，模块
 */
class User {
    static login(request, response) {
        const username = request.body.username;
        const password = request.body.password;
        loginService_1.loginService.loginDeal(username, password, (resultBean) => {
            response.json(resultBean);
        });
    }
    static register(request, response) {
    }
}
exports.User = User;
