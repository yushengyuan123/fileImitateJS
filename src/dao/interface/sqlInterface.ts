export interface sqlFunc {
    connect ?(): any
    selectSql(connect ?: any): any
    updateSql(connect ?: any): any
    insertSql(connect ?: any): any
}

/**
 * 获得用户信息
 */
export let getUserInfoSql = 'select * from user'

