/**
 * 去除数组首部的''
 */
export function removeNone(array: Array<any>) {
    if (array[0] === '') {
        array.shift()
    }
}
