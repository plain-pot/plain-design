import {PlainObject, tRequestConfig, tTableOptionConfig} from "../createUseTableOption.utils";
import {TableNode} from "../../PlTable/core/useTableNode";

export function createSyncHooks<Handler extends (arg: any) => any,
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

export function createHooks<Handler extends (arg: any) => any,
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

export function useTableHooks({config}: { config: tTableOptionConfig }) {
    const hooks = {
        /*点击行*/
        onClickRow: createHooks<(selectNode: TableNode) => void>(),                                // 异步钩子，行单击
        onDblClickRow: createHooks<(selectNode: TableNode) => void>(),                             // 异步钩子，行双击
        onSelectChange: createHooks<(selectNode: TableNode) => void>(),                            // 异步钩子，单选行变化
        onCheckChange: createHooks<(data: { checked: any[], status: 'checked' | 'uncheck' | 'minus' }) => void>(),// 多选发生变化

        /*分页查询*/
        onBeforeLoad: createHooks<(requestConfigObject: tRequestConfig) => void>(),                 // 异步钩子，加载数据之前
        onAfterLoad: createHooks<(rows: PlainObject[]) => void>(),                                  // 异步钩子，加载数据之后
        onLoaded: createSyncHooks<(rows: PlainObject[]) => void>(),                                 // 同步钩子，处理完加载的数据之后

        /*删除*/
        onBeforeDelete: createHooks<(requestConfigObject: tRequestConfig) => void>(),               // 异步钩子，保存删除之前
        onAfterDelete: createHooks<(resp: any) => void>(),                                          // 异步钩子，保存删除之后

        /*新建*/
        onBeforeEnableInsert: createHooks(),                                                        // 异步钩子，开始开启新建之前
        onBeforeInsert: createHooks<(requestConfigObject: tRequestConfig) => void>(),               // 异步钩子，保存新建之前
        onAfterInsert: createHooks<(resp: any) => void>(),                                          // 异步钩子，保存新建之后

        /*复制*/
        onBeforeEnableCopy: createHooks<(row: any) => void>(),                                      // 异步钩子，判断一行是否可以复制
        onBeforeCopy: createHooks<(row: any) => void>(),                                            // 异步钩子，判断一行（经过excludeKeys排除了部分属性）是否可以复制

        /*更新*/
        onBeforeEnableUpdate: createHooks<(row: any) => void>(),                                    // 异步钩子，开启普通行编辑状态之前
        onBeforeUpdate: createHooks<(requestConfigObject: tRequestConfig) => void>(),               // 异步钩子，普通行编辑保存之前
        onAfterUpdate: createHooks<(resp: any) => void>(),                                          // 异步钩子，普通行编辑保存之后

        /*表格相关*/
        // onCollectRenderColumns: createHooks<(renderColumns: iRenderColumn[]) => void>(),            // 异步钩子，获取到列信息的时候
        // onColumns: createSyncHooks<(content: ReactNodeArray) => void>(),                            // 同步钩子，用来处理列信息
        // onButtons: createSyncHooks<(buttons: iO2TableButtonConfig[]) => void>(),                    // 同步钩子，用来处理按钮信息
    }

    /*if (!!config.hooks) {
        Object.entries(config.hooks).forEach(([hookName, hookFunc]) => (hooks as any)[hookName].use(hookFunc))
    }*/

    return hooks
}

export type tTableHooks = ReturnType<typeof useTableHooks>