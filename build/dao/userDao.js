"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlConnect_1 = require("./sqlConnect");
const sql = require("./interface/sqlInterface");
class UserDao extends sqlConnect_1.sqlConnect {
    constructor() {
        super();
        this.con = this.connect(this.con);
    }
    insertSql() {
    }
    selectSql() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.select(this.con, sql.getUserInfoSql);
        });
    }
    updateSql() {
    }
}
exports.UserDao = UserDao;
