export function parseSqlResult(result: any) {
    return  JSON.parse(JSON.stringify(result))
}
