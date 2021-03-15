/**
 * 方便创建监听原生事件的监听函数
 * @author  韦胜健
 * @date    2020/12/14 17:47
 */
import {DOMAttributes} from "react";

export function createEventListener<Config extends Partial<{ [k in keyof DOMAttributes<HTMLElement>]: (e: DOMAttributes<HTMLElement>[k]) => void }>>(config: Config): Config {
    return config
}