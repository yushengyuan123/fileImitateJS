"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 去除数组首部的''
 */
function removeNone(array) {
    if (array[0] === '') {
        array.shift();
    }
}
exports.removeNone = removeNone;
