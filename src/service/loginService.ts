import {UserDao} from "../dao/userDao";
import {ResultBean} from "../utils/resultBean";
import {currentUser} from "../core";

export class loginService {
    public static loginDeal(
        username: string,
        password: string,
        cb ?: Function): void {
            let dao: UserDao = new UserDao()
            dao.selectSql().then(res => {
                const results: any = JSON.parse(JSON.stringify(res))
                const resultBean = new ResultBean()

                for (let i = 0; i < results.length; i++) {
                    //登陆成功
                    if (username === results[i].username &&
                        password === results[i].password) {
                        // @ts-ignore
                        currentUser = username
                        if (cb) {
                            try {
                                cb(resultBean.successBean('登陆成功', {
                                    username: currentUser
                                }))
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        return
                    }
                }

                if (cb) {
                    try {
                        cb(resultBean.failBean('没有这个账户'))
                    } catch (e) {
                        console.log(e)
                    }
                }
                return;
            })
    }

    public static registerDeal() {

    }
}
