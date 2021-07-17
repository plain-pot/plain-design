import {iTableSortData, PlainObject, tRequestConfig, tTableOptionConfig} from "../createUseTableOption.utils";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import PlTable from "../../PlTable";
import {reactive} from "plain-design-composition";
import React, {ReactNode} from "react";
import {tPlcData} from "../../PlTable/plc/format/formatPlcList";
import {iFilterData} from "../../PlFilter/FilterConfig";
import {tPlcType} from "../../PlTable/plc/utils/plc.type";

export interface iTableProRenderConfig {
    seq: number,
    render: () => ReactNode
}

export function createSyncHooks<Handler extends (arg: any) => any,
    InnerHandler = (arg: Parameters<Handler>["0"]) => (void | Parameters<Handler>["0"]),
    >(isReactive?: boolean) {
    const state: { innerHandlers: InnerHandler[] } = isReactive ? reactive({
        innerHandlers: [] as InnerHandler[],
    }) : ({
        innerHandlers: [] as InnerHandler[],
    }) as any
    const use = (handler: InnerHandler) => {
        state.innerHandlers = [...state.innerHandlers, handler] as any
        return () => eject(handler)
    }
    const eject = (handler: InnerHandler) => {
        state.innerHandlers = state.innerHandlers.filter(i => i !== handler)
    }
    const exec = (arg: Parameters<Handler>["0"]): Parameters<Handler>["0"] => {
        if (state.innerHandlers.length === 0) {return arg}
        let index = 0
        let innerHandler: InnerHandler | undefined = state.innerHandlers[index] as any
        while (!!innerHandler) {
            let newArg = (innerHandler as any)(arg);
            if (newArg !== undefined) {arg = newArg}
            index++
            innerHandler = state.innerHandlers[index] as any
        }
        return arg
    }
    return {use, eject, exec, state, getListeners: () => [...state.innerHandlers]}
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
    return {use, eject, exec, getListeners: () => [...innerHandlers]}
}

export function useTableOptionHooks({config}: { config: tTableOptionConfig }) {
    const hooks = {
        /*点击行*/
        onClickCell: createHooks<(selectNode: TableNode) => void>(),                                // 异步钩子，行单击
        onDblClickCell: createHooks<(selectNode: TableNode) => void>(),                             // 异步钩子，行双击
        onSelectChange: createHooks<(selectNode: TableNode) => void>(),                             // 异步钩子，单选行变化
        onCheckChange: createHooks<(data: { checked: any[], status: 'checked' | 'uncheck' | 'minus' }) => void>(),// 多选发生变化
        onClickHead: createHooks<(data: { plc: tPlcType, e: React.MouseEvent }) => void>(),         // 点击标题动作

        /*分页查询*/
        onRequestData: createHooks<(requestData: Record<string, any>) => void>(),                   // 处理请求参数
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
        onRefTable: createSyncHooks<(table: typeof PlTable.use.class) => void>(),                   // 获取table对象的引用
        onLoading: createSyncHooks<(flag: boolean) => void>(true),                         // 当前是否开启加载状态
        onColumns: createSyncHooks<(children: ReactNode) => void>(true),                   // 渲染Table的内容
        onButtons: createSyncHooks<(content: ReactNode) => void>(true),                    // 同步钩子，用来处理按钮信息
        onTableRender: createSyncHooks<(renderConfigs: iTableProRenderConfig[]) => void>(true),// table渲染钩子
        onInit: createHooks<() => void>(),                                                          // 异步钩子函数，等待init执行完毕之后，再渲染table
        onQueryParams: createHooks<() => PlainObject>(),                                            // 异步钩子函数，获取查询参数

        onCollectPlcData: createHooks<(plcData: tPlcData) => void>(),                               // 收集到plcData动作
        onCollectFilterData: createHooks<(filterData: iFilterData[]) => void>(),                    // 收集筛选参数
        onCollectSortData: createSyncHooks<(sortData: iTableSortData[]) => void>(true),         // 收集排序数据
    }

    if (!!config.hooks) {
        Object.entries(config.hooks).forEach(([hookName, hookFunc]) => (hooks as any)[hookName].use(hookFunc))
    }

    return hooks
}

export type tTableOptionHooks = ReturnType<typeof useTableOptionHooks>

export type tTableOptionConfigHook = { [k in keyof tTableOptionHooks]?: Parameters<tTableOptionHooks[k]["use"]>[0] }