import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import useTableOption from "../../../useTableOption";
import React from "react";
import {iTableProConfig, PlainObject} from "../../createUseTableOption.utils";
import {designPage, useRefs} from "plain-design-composition";
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

export type tFilterDistinctValue = string | number

/**
 *在打开去重筛选弹框的时候，需要获取一遍当前表格的查询参数，在获取的同时要排除掉这个列的去重筛选条件参数
 * @author  韦胜健
 * @date    2021/7/17 19:04
 */
let excludePlcListWhenCollectFilterData: tPlc[] = []

export function useTableOptionDistinctFilter({hooks, methods, customConfig}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig }) {

    const $dialog = useDialog()

    const {refs, onRef} = useRefs({check: PlcCheckRow})

    const state = {
        baseTableRef: () => null as null | tPlTable,
        selectedMap: new Map<tPlc, PlainObject[] | undefined>(),                // 已经选中的数据，再次打开distinct对话框的时候要显示已经选中的行
        distinctFilterValueMap: new Map<tPlc, (string | number)[]>(),           // 去重筛选条件
    }

    hooks.onRefTable.use(table => {state.baseTableRef = () => table})

    /*查询的时候被收集筛选条件*/
    hooks.onCollectFilterData.use((data) => {
        let queries: iFilterQuery[] = []
        /*去重筛选条件*/
        Array.from(state.distinctFilterValueMap.entries()).forEach(([plc, distinctValues]) => {
            if (distinctValues.length === 0 || excludePlcListWhenCollectFilterData.indexOf(plc) > -1) {return}
            queries.push({field: plc.props.field!, operator: 'in', value: distinctValues,})
        })
        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    const pick = async ({plc}: {
        plc: tPlc,
    }): Promise<tFilterDistinctValue[]> => {

        const dfd = defer<tFilterDistinctValue[]>()

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
                    <PlcCheckRow toggleOnClickRow ref={onRef.check} selected={state.selectedMap.get(plc)}/>
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
                (!!checked && checked.length > 0) ? state.selectedMap.set(plc, checked) : state.selectedMap.delete(plc)
                const distinctValues = !checked ? [] : checked.map((i) => i[plc.props.field!])
                onRef.check(null)
                dlgOpt.close!()
                dfd.resolve(distinctValues)
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
        const distinctValues = await pick({plc})
        if (distinctValues.length === 0) {
            state.distinctFilterValueMap.delete(plc)
        } else {
            state.distinctFilterValueMap.set(plc, distinctValues)
        }
        methods.pageMethods.reload()
    }

    const clear = (fto: iFilterTargetOption) => {
        state.distinctFilterValueMap.delete(fto!.option.plc!)
        methods.pageMethods.reload()
    }

    return {
        open,
        clear,
    }
}