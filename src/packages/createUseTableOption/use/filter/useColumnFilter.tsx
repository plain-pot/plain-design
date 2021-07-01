import {tTableOptionHooks} from "../use.hooks";
import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import useContextmenu from "../../../useContextmenu";
import React from "react";
import {tTableOptionMethods} from "../use.methods";

interface ColumnFilterData {
    desc: null | boolean,
    fto: iFilterTargetOption,
    distinctFilterValues: null | string[],
}

export function useColumnFilter({hooks, methods}: { hooks: tTableOptionHooks, methods: tTableOptionMethods }) {

    const $contextmenu = useContextmenu()

    const getColumnKey = (plc: tPlc) => plc.props.field! + (plc.props.title || '#_#')

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        columnFilterDataMap: {} as Record<string, ColumnFilterData>,
    })
    hooks.onCollectPlcData.use(val => {
        const flatPlcList = val.sourceFlatPlcList.filter(i => !!i.props.field)
        state.getSourceFlatPlcList = (() => flatPlcList)
        const oldColumnFilterDataMap = state.columnFilterDataMap
        state.columnFilterDataMap = flatPlcList.reduce((prev, plc) => {
            const key = getColumnKey(plc)
            const oldColumnFilterData = oldColumnFilterDataMap[key]
            prev[key] = !!oldColumnFilterData ? {...oldColumnFilterData} : {
                desc: null,
                distinctFilterValues: null,
                fto: FilterConfig.getTargetOption({
                    label: plc.props.title!,
                    field: plc.props.field!,
                    value: null,
                    filterName: plc.props.filterName,
                    handlerName: plc.props.filterHandler,
                    filterConfig: plc.props.filterConfig,
                    plc,
                })!,
            }
            return prev
        }, {} as Record<string, ColumnFilterData>)
    })

    hooks.onClickHead.use(({plc, e}) => {
        /*分组表头不做处理, 仅处理列表头*/
        if (plc.group) {return}
        const columnKey = getColumnKey(plc)
        const columnFilterData = state.columnFilterDataMap[columnKey]
        if (!columnFilterData) {return;}

        const menuOpt = {} as any

        $contextmenu(e.currentTarget, () => <>
            <div style={{width: '200px', padding: '12px'}} onClick={() => menuOpt.hide()}>
                排序
            </div>
        </>, menuOpt)
    })

    return {
        state,
    }
}