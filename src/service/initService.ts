import {initUserRoot} from "../core/catalogue/userCatalogue";
import {ResultBean} from "../utils/resultBean";

export class InitService {
    public static initData(request: any, response: any) {
        const results = new ResultBean();
        initUserRoot()
        response.json(results.successBean('初始化完成'));
    }
}
