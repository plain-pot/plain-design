import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import useTableOption from "../../../useTableOption";
import React from "react";
import {iTableProConfig, PlainObject} from "../../createUseTableOption.utils";
import {computed, designPage, useRefs} from "plain-design-composition";
import PlTablePro from "../../../PlTablePro";
import useDialog, {DialogServiceFormatOption} from "../../../useDialog";
import {defer} from "../../../../utils/defer";
import PlcCheckRow from "../../../PlcCheckRow";
import {iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import {tTableOptionHooks} from "../use.hooks";
import {toArray} from "../../../../utils/toArray";
import {tTableOptionMethods} from "../use.methods";
import {tPlTable} from "../../../PlTable";
import {findRreactElement} from "../../../../utils/findReactElement";
import {tTableOptionFilter} from "../use.filter.state";
import {getPlcKey} from "./use.filter.utils";

/**
 *在打开去重筛选弹框的时候，需要获取一遍当前表格的查询参数，在获取的同时要排除掉这个列的去重筛选条件参数
 * @author  韦胜健
 * @date    2021/7/17 19:04
 */
let excludePlcListWhenCollectFilterData: tPlc[] = []

export type tFilterDistinctValue = string | number

interface iFilterTypeData {
    values: tFilterDistinctValue[] | undefined,
    rows: PlainObject[] | undefined,
}

export function useTableOptionDistinctFilter({hooks, methods, customConfig, filterState}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, filterState: tTableOptionFilter }) {

    const $dialog = useDialog()

    const {refs, onRef} = useRefs({check: PlcCheckRow})

    const state = {
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        baseTableRef: () => null as null | tPlTable,
    }

    const data = filterState.useState<Map<tPlc, iFilterTypeData | undefined>, Record<string, iFilterTypeData | undefined>>({
        key: 'distinct-filter',
        title: '去重筛选',
        state: new Map(),
        onReady: (flatPlcList, cacheData) => {
            state.getSourceFlatPlcList = () => flatPlcList
            if (!!cacheData) {
                const map = new Map<tPlc, iFilterTypeData>()
                Object.entries(cacheData).forEach(([key, filterTypeData]) => {
                    const plc = flatPlcListMap.value[key]
                    if (!!plc && !!filterTypeData) {
                        map.set(plc, filterTypeData)
                    }
                })
                data.state = map
            }
        },
        getActiveFilterCount: (): number => {
            return Array.from(data.state.values()).reduce((prev, filterTypeData) => prev + (!filterTypeData || !filterTypeData.values || filterTypeData.values.length === 0 ? 0 : 1), 0)
        },
        getDisplay: () => () => <>
            去重筛选
        </>,
        clear: () => {
            data.state.clear()
        },
        getCacheData: (): Record<string, iFilterTypeData | undefined> => {
            return Array.from(data.state.entries()).reduce((prev, [plc, fd]) => {
                const key = getPlcKey(plc)
                prev[key] = fd
                return prev
            }, {} as Record<string, iFilterTypeData | undefined>)
        },
    })

    const flatPlcListMap = computed((): Record<string, tPlc | undefined> => !state.getSourceFlatPlcList ? {} : state.getSourceFlatPlcList().reduce((prev, plc) => {
        prev[getPlcKey(plc)] = plc
        return prev
    }, {} as Record<string, tPlc | undefined>))

    hooks.onRefTable.use(table => {state.baseTableRef = () => table})

    /*查询的时候被收集筛选条件*/
    hooks.onCollectFilterData.use((prev) => {
        let queries: iFilterQuery[] = Array.from(data.state.entries()).reduce((prev, [plc, filterTypeData]) => {
            if (!!filterTypeData && !!filterTypeData.values && filterTypeData.values.length > 0) {
                prev.push({field: plc.props.field!, operator: "in", value: filterTypeData.values})
            }
            return prev
        }, [] as iFilterQuery[])
        return !!queries && queries.length > 0 ? [...prev, {queries: toArray(queries),}] : prev
    })

    const pick = async ({plc}: {
        plc: tPlc,
    }): Promise<void> => {

        const dfd = defer<void>()

        /*表格中已经存在的筛选参数，但是要排除当前列的去重查询参数*/
        excludePlcListWhenCollectFilterData.push(plc)
        const existFilterDataExcludePlcDistinctFilterValue = await hooks.onCollectFilterData.exec([])
        excludePlcListWhenCollectFilterData.splice(0, 1)

        /*表格中使用的排序参数*/
        const sortData = await hooks.onCollectSortData.exec([])

        const tableSlots = state.baseTableRef()!.slots.default()
        const findReactNode = findRreactElement(tableSlots, ({props: {title, field}}) => title === plc.props.title && field === plc.props.field)
        // console.log({tableSlots, findReactNode,})

        const Content = designPage(() => {
            const tableOption = useTableOption({
                ...customConfig,
                keyField: plc.props.field,
                enable: false,
                sort: sortData,
                buttons: [],
                queryParams: {
                    distinctFields: [plc.props.field]
                },
                filterParam: existFilterDataExcludePlcDistinctFilterValue,
            })

            return () => <>
                <PlTablePro option={tableOption}>
                    <PlcCheckRow toggleOnClickRow ref={onRef.check} selected={data.state.get(plc)?.rows}/>
                    {findReactNode}
                </PlTablePro>
            </>
        })

        const dlgOpt: Partial<DialogServiceFormatOption> = {
            title: plc.props.title,
            status: null,
            render: () => <Content/>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            confirmButton: true,
            cancelButton: true,
            onConfirm: () => {
                const checked = refs.check?.getSelected();
                (!!checked && checked.length > 0) ? data.state.set(plc, {
                    rows: checked,
                    values: checked.map((i) => i[plc.props.field!]),
                }) : data.state.delete(plc)


                onRef.check(null)
                dlgOpt.close!()
                dfd.resolve()
            },
            onCancel: async () => {
                onRef.check(null)
                dlgOpt.close!()
                dfd.reject('cancel')
            },
        }

        $dialog(dlgOpt)

        return dfd.promise
    }

    /**
     * 打开去重筛选弹框
     * @author  韦胜健
     * @date    2021/7/17 19:06
     */
    const open = async (fto: iFilterTargetOption) => {
        const field = fto!.option.field
        const plc = fto!.option.plc
        if (!field || !plc) {return console.warn('distinct filter: no field or plc!')}

        /**
         * 获取去重筛选条件的值
         * @author  韦胜健
         * @date    2021/7/17 19:06
         */
        await pick({plc})
        await methods.pageMethods.reload()
    }

    const clear = (fto: iFilterTargetOption) => {
        data.state.delete(fto!.option.plc!)
        methods.pageMethods.reload()
    }

    return {
        open,
        clear,
    }
}
