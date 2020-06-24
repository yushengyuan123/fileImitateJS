"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResultBean {
    successBean(message, data) {
        return {
            code: 1,
            message: message,
            data: data ? data : null
        };
    }
    failBean(message, data) {
        return {
            code: -1,
            message: message,
            data: data ? data : null
        };
    }
}
exports.ResultBean = ResultBean;
