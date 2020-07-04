import {ResultBean} from "../utils/resultBean";
import {discSize, MAXSIZE} from "../core";
import {views} from "../core/positionViews/positionViews";

export class Disc {
    public static discSpaceService(request: any, response: any) {
        const result: ResultBean = new ResultBean()
        response.json(result.successBean('获取成功', {
            max: MAXSIZE,
            used: discSize
        }))
    }

    public static getViews(request: any, response: any) {
        const result: ResultBean = new ResultBean()
        response.json(result.successBean('获取成功', {
            views: views.getViews()
        }))
    }
}
