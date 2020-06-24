import {loginService} from "../service/loginService";
import {ResultBean} from "../utils/resultBean";

/**
 * 用户登陆注册，模块
 */
export class User {
    public static login(request: any, response: any): void {
        const username = request.body.username
        const password = request.body.password
        loginService.loginDeal(username, password,
            (resultBean: object): void => {
            response.json(resultBean);
        })
    }

    public static register(request: any, response: any): void {

    }
}
