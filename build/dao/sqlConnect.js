"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 数据库连接池
 */
const mysql = require("mysql");
class sqlConnect {
    constructor() {
        this.config = {
            host: 'localhost',
            user: 'root',
            password: 'ysy2266833ysy??',
            port: '3306',
            database: 'files'
        };
    }
    //数据库连接
    connect(connection) {
        connection = mysql.createConnection(this.config);
        connection.connect();
        return connection;
    }
    insertSql() {
    }
    select(connection, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    updateSql() {
    }
}
exports.sqlConnect = sqlConnect;
function test() {
    let config = {
        host: 'localhost',
        user: 'root',
        password: 'ysy2266833ysy??',
        database: 'files'
    };
    mysql.createConnection(config);
}
