/** 这里是维护所有注册用户的目录文件 **/
import {Catalogue} from "./catalogue";
import {UserDao} from "../../dao/userDao";
import {parseSqlResult} from "../../utils/utils";
import {User} from "../../server/user";

//todo 测试先这么写着把 以后删了
// export const UserRoot: Array<Catalogue> = [initRoot('15521064831')]
export const UserRoot: Array<Catalogue> = [initRoot('15521064831'), initRoot('13652235647')]

/**
 * 只要有用户注册了，就马上调用这个函数给用户加上一个根目录
 */
export let initUserRoot = function (): void {
    let dao: UserDao = new UserDao()
    dao.selectSql().then(res => {
        const results: any = parseSqlResult(res)
    })
}

/**
 * 用户注册增加目录
 */
function addRoot(username: string): void {
    UserRoot.push(initRoot(username))
}

/**
 * 初始化用户的更目录
 */
function initRoot(username: string): Catalogue {
    console.log(username)
    const root = new Catalogue()

    root.path = '/'

    root.user = username

    return root
}
