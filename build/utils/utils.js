"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseSqlResult(result) {
    return JSON.parse(JSON.stringify(result));
}
exports.parseSqlResult = parseSqlResult;
