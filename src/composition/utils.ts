/**
 * 判断是否为dom对象
 * @author  韦胜健
 * @date    2020/7/19 9:02
 */
export function isDom(object: HTMLElement | any): object is HTMLElement {
    if (!object) return false;

    return typeof HTMLElement === "object" ?
        object instanceof HTMLElement :
        (typeof object === "object" && object.nodeType === 1 && typeof object.nodeName === "string");
}