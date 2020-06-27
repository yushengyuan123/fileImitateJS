"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userCatalogue_1 = require("../core/catalogue/userCatalogue");
const resultBean_1 = require("../utils/resultBean");
class InitService {
    static initData(request, response) {
        const results = new resultBean_1.ResultBean();
        userCatalogue_1.initUserRoot();
        response.json(results.successBean('初始化完成'));
    }
}
exports.InitService = InitService;
