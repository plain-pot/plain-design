import {useRef, useState} from "react";
import {createPlainEvent, SimpleFunction} from "./event";

/**
 * designComponent中emits对象类型
 * @author  韦胜健
 * @date    2021/3/9 18:12
 */
export type ObjectEmitOptions = Record<string, (...args: any[]) => boolean>

/**
 * 获取监听事件的回调函数类型
 * @author  韦胜健
 * @date    2021/3/9 18:13
 */
type EventListener<EmitsValue> = EmitsValue extends (...args: any[]) => any ? Parameters<EmitsValue> : never

/**
 * Event对象类型
 * @author  韦胜健
 * @date    2021/3/9 18:13
 */
export type ComponentEvent<Emit> = {
    emit: { [key in keyof Emit]: (...args: EventListener<Emit[key]>) => void },
    on: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
    once: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
    off: { [key in keyof Emit]: (cb: (...args: EventListener<Emit[key]>) => void) => void },
}

/**
 * emits转化成props的对象类型
 * @author  韦胜健
 * @date    2021/3/9 18:13
 */
export type EmitToProp<E extends Record<string, (...args: any[]) => any>> =
    ('onUpdateModelValue' extends keyof E ? { onChange?: (...args: Parameters<E['onUpdateModelValue']>) => void } : {}) &
    {
        [k in keyof E]?: E[k] extends ((...args: any[]) => any) ? (...args: Parameters<E[k]>) => void : E[k]
    };

/**
 * 创建setupEvent对象
 * @author  韦胜健
 * @date    2021/3/9 18:14
 */
export function useEvent<T extends ObjectEmitOptions = {}>(fcProps: any, emitsOptions?: T): { setupEvent: ComponentEvent<T> } {
    const emitter = useRef({} as any)
    if (!!emitsOptions) {
        Object.keys(emitsOptions)
            .forEach(emitName => {
                emitter.current[emitName] !== fcProps[emitName] && (emitter.current[emitName] = fcProps[emitName])
                if (emitName === 'onUpdateModelValue' && emitter.current.onChange !== fcProps.onChange) {
                    emitter.current.onChange = fcProps.onChange
                }
            })
    }
    const [ret] = useState(() => {
        const event = createPlainEvent()

        const emit = {} as any;
        const on = {} as any;
        const once = {} as any;
        const off = {} as any;

        if (!!emitsOptions) {
            const keys = Object.keys(emitsOptions)
            keys.forEach(key => {
                emit[key] = (...args: any[]) => {
                    !!emitter.current[key] && emitter.current[key](...args)
                    event.emit(key, ...args)
                    if (key === 'onUpdateModelValue') {
                        !!emitter.current.onChange && emitter.current.onChange(...args)
                        event.emit('onChange', ...args)
                    }
                }
                on[key] = (fn: SimpleFunction) => event.on(key, fn)
                once[key] = (fn: SimpleFunction) => event.once(key, fn)
                off[key] = (fn: SimpleFunction) => event.off(key, fn)
            })
        }

        return {emit, on, once, off}
    })
    return {setupEvent: ret}
}