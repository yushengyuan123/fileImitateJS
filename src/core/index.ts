/**
 * 当前使用的用户的username
 */
export let currentUser: string = '';

/**
 * 用户当前目录
 */
export let currentCatalogue: string = '/'

/**
 * MB单位
 */
export const MB: number = 1024;

/**
 * 磁盘最大空间
 */
export const MAXSIZE: number = 10 * MB;

/**
 * 磁盘空间
 */
export let discSize: number = 10 * MB;

/**
 * 每一块的大小
 */
export let discBlockSize: number = 512

/**
 * 磁盘的块数
 */
export let discBlock_number: number = discSize / discBlockSize

/**
 * 规定一个folder是256字节
 */
export const folderSize = 0;

/**
 * 规定一个文字是8个字节
 */
export const fontSize = 8

/**
 * 定义文件类型，txt还是folder
 */
export enum file_type {
    folder,
    txt
}

export enum operation_muster {
    crete,
    update,
    delete
}
