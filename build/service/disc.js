"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resultBean_1 = require("../utils/resultBean");
const core_1 = require("../core");
const positionViews_1 = require("../core/positionViews/positionViews");
class Disc {
    static discSpaceService(request, response) {
        const result = new resultBean_1.ResultBean();
        response.json(result.successBean('获取成功', {
            max: core_1.MAXSIZE,
            used: core_1.discSize
        }));
    }
    static getViews(request, response) {
        const result = new resultBean_1.ResultBean();
        response.json(result.successBean('获取成功', {
            views: positionViews_1.views.getViews()
        }));
    }
}
exports.Disc = Disc;
