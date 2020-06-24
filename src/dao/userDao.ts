import {sqlConnect} from "./sqlConnect";
import mysql from 'mysql'
import * as sql from './interface/sqlInterface'

export class UserDao extends sqlConnect {
    private readonly con: mysql

    constructor() {
        super();
        this.con = this.connect(this.con)
    }

    insertSql(): any {

    }

    async selectSql(): Promise<any> {
        return await this.select(this.con, sql.getUserInfoSql);
    }

    updateSql(): any {

    }

}
