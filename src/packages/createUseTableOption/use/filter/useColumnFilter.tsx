import {tTableOptionHooks} from "../use.hooks";
import {computed, reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import useContextmenu from "../../../useContextmenu";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import PlButton from "../../../PlButton";
import './column.filter.scss'
import PlFilter from "../../../PlFilter";
import PlIcon from "../../../PlIcon";

interface ColumnFilterData {
    desc: null | boolean,
    option: iFilterOption,
    distinctFilterValues: null | string[],
}

interface ColumnFilterTargetData {
    desc: null | boolean,
    option: iFilterOption,
    fto?: iFilterTargetOption,
    distinctFilterValues: null | string[],
}

export function useColumnFilter({hooks, methods}: { hooks: tTableOptionHooks, methods: tTableOptionMethods }) {

    const $contextmenu = useContextmenu()

    const getColumnKey = (plc: tPlc) => plc.props.field! + (plc.props.title || '#_#')

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        columnFilterDataMap: {} as Record<string, ColumnFilterData>,
    })

    const columnFilterTargetDataMap = computed(() => Object.entries(state.columnFilterDataMap).reduce((prev, [columnKey, cfd]) => {
        prev[columnKey] = {
            ...cfd,
            fto: FilterConfig.getTargetOption(cfd.option)
        }
        return prev
    }, {} as Record<string, ColumnFilterTargetData>))

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
                option: {
                    label: plc.props.title!,
                    field: plc.props.field!,
                    value: null,
                    filterName: plc.props.filterName,
                    handlerName: plc.props.filterHandler,
                    filterConfig: plc.props.filterConfig,
                    plc,
                }
            }
            return prev
        }, {} as Record<string, ColumnFilterData>)
    })

    hooks.onClickHead.use(({plc, e}) => {
        /*分组表头不做处理, 仅处理列表头*/
        if (plc.group) {return}
        const menuOpt = {} as any

        $contextmenu(e.currentTarget, () => {
            const columnKey = getColumnKey(plc)
            const columnFilterTargetData = columnFilterTargetDataMap.value[columnKey]
            if (!columnFilterTargetData) {return;}
            return <>
                <div onClick={e => e.stopPropagation()} className="pro-column-filter-container">
                    <div className="pro-column-filter-sort-container">
                        <div className="pro-column-filter-sort-item pro-column-filter-sort-item-active">
                            <PlIcon icon="el-icon-upload1"/>
                            <span>升序</span>
                        </div>
                        <div className="pro-column-filter-sort-item">
                            <PlIcon icon="el-icon-download"/>
                            <span>降序</span>
                        </div>
                    </div>
                    <div>
                        <PlFilter fto={columnFilterTargetData.fto} hideSearchButton onConfirm={methods.pageMethods.reload}/>
                    </div>
                    <div>
                        <PlButton mode="stroke" icon="el-icon-thumb" label="关闭" onClick={() => menuOpt.hide()}/>
                    </div>
                </div>
            </>
        }, menuOpt)
    })

    return {
        state,
    }
}