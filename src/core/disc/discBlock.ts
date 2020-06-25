/**
 * 盘块
 */
export class DiscBlock {
    //物理块号下标
    public index: number = null;

    //下一块的指针,指向它的物理块号
    public nextIndex: number = null;
}
