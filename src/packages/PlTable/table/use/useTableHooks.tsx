/**
 * 创建一个异步的hook管理器
 * @author  韦胜健
 * @date    2021/5/8 15:13
 */
import {tPlcType} from "../../plc/core/plc.utils";

export function createTableHook<Handler extends (arg: any) => any,
    InnerHandler = (arg: Parameters<Handler>["0"]) => (void | Parameters<Handler>["0"] | Promise<void | Parameters<Handler>["0"]>),
    >() {
    const innerHandlers: InnerHandler[] = []
    const use = (handler: InnerHandler) => {
        innerHandlers.push(handler)
        return () => eject(handler)
    }
    const eject = (handler: InnerHandler) => {
        const index = innerHandlers.indexOf(handler)
        if (index > -1) {
            innerHandlers.splice(index, 1)
        }
    }
    const exec = async (arg: Parameters<Handler>["0"]): Promise<Parameters<Handler>["0"]> => {
        if (innerHandlers.length === 0) {return arg}
        let index = 0
        let innerHandler: InnerHandler | undefined = innerHandlers[index]
        while (!!innerHandler) {
            let newArg = await (innerHandler as any)(arg);
            if (newArg !== undefined) {arg = newArg}
            index++
            innerHandler = innerHandlers[index]
        }
        return arg
    }
    return {use, eject, exec}
}

/**
 * 创建一个同步的hook管理器
 * @author  韦胜健
 * @date    2021/5/8 15:13
 */
export function createSyncTableHook<Handler extends (arg: any) => any,
    InnerHandler = (arg: Parameters<Handler>["0"]) => (void | Parameters<Handler>["0"]),
    >() {
    const innerHandlers: InnerHandler[] = []
    const use = (handler: InnerHandler) => {
        innerHandlers.push(handler)
        return () => eject(handler)
    }
    const eject = (handler: InnerHandler) => {
        const index = innerHandlers.indexOf(handler)
        if (index > -1) {
            innerHandlers.splice(index, 1)
        }
    }
    const exec = (arg: Parameters<Handler>["0"]): Parameters<Handler>["0"] => {
        if (innerHandlers.length === 0) {return arg}
        let index = 0
        let innerHandler: InnerHandler | undefined = innerHandlers[index]
        while (!!innerHandler) {
            let newArg = (innerHandler as any)(arg);
            if (newArg !== undefined) {arg = newArg}
            index++
            innerHandler = innerHandlers[index]
        }
        return arg
    }
    return {use, eject, exec}
}

export function useTableHooks() {
    const hooks = {
        onCollectPlc: createSyncTableHook<(plcTypeArr: tPlcType[]) => void>(),
        onTableMounted: createTableHook<(el: HTMLDivElement) => void>(),
    }
    return hooks
}

export type tTableHooks = ReturnType<typeof useTableHooks>