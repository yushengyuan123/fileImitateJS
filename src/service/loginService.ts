import {UserDao} from "../dao/userDao";
import {ResultBean} from "../utils/resultBean";

export class loginService {
    public static loginDeal(
        username: string,
        password: string,
        cb ?: Function): void {
            let dao: UserDao = new UserDao()
            dao.selectSql().then(res => {
                const results = JSON.stringify(JSON.parse(res))
                const resultBean = new ResultBean()

                for (let i = 0; i < results.length; i++) {
                    //登陆成功
                    if (username === res[i].username &&
                        password === res[i].password) {
                        if (cb) {
                            try {
                                cb(resultBean.successBean('登陆成功'))
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
