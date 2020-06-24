/**
 * 数据库连接池
 */
import mysql = require("mysql");
import * as sql from './interface/sqlInterface'

export class sqlConnect{
    private config: object = {
        host: 'localhost',
        user     : 'root',
        password : 'ysy2266833ysy??',
        port: '3306',
        database : 'files'
    }

    //数据库连接
    public connect(connection: any): any {
        connection = mysql.createConnection(this.config)
        connection.connect()
        return connection
    }


    insertSql(): any {
    }

    select(connection: any, sql: string): Promise<any> {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (error, results, fields) {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })
    }

    updateSql(): any {
    }
}

function test() {

    let config: object = {
        host: 'localhost',
        user: 'root',
        password: 'ysy2266833ysy??',
        database: 'files'
    }

    mysql.createConnection(config)

}

