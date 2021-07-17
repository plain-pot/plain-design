import {tTableOptionHooks} from "../use.hooks";
import {classnames, computed, reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import useContextmenu from "../../../useContextmenu";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import PlButton from "../../../PlButton";
import './column.filter.scss'
import PlFilter from "../../../PlFilter";
import PlIcon from "../../../PlIcon";
import {toArray} from "../../../../utils/toArray";
import {ContextmenuServiceOption} from "../../../useContextmenu/PlContextMenuService";
import {useTableOptionDistinctFilter} from "./useDistinctFilter";
import {iTableProConfig} from "../../createUseTableOption.utils";
import PlButtonGroup from "../../../PlButtonGroup";
import {ColumnFilterData, ColumnFilterTargetData} from "./use.filter.utils";
import {tTableOptionSort} from "../use.sort";

export function useTableOptionColumnFilter({hooks, methods, customConfig, tableSort}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, tableSort: tTableOptionSort }) {

    const distinct = useTableOptionDistinctFilter({customConfig, methods, hooks})

    const $contextmenu = useContextmenu()

    const getColumnKey = (plc: tPlc) => plc.props.field! + (plc.props.title || '#_#')

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),                    // 原始列信息对象
        columnFilterDataMap: {} as Record<string, ColumnFilterData>,            // 列筛选配置信息对象
    })

    /*列目标筛选配置信息对象*/
    const columnFilterTargetDataMap = computed(() => Object.entries(state.columnFilterDataMap).reduce((prev, [columnKey, cfd]) => {
        prev[columnKey] = {
            ...cfd,
            fto: FilterConfig.getTargetOption(cfd.option),
        }
        return prev
    }, {} as Record<string, ColumnFilterTargetData>))

    /*收集列信息*/
    hooks.onCollectPlcData.use(val => {
        const flatPlcList = val.sourceFlatPlcList.filter(i => !!i.props.field)
        state.getSourceFlatPlcList = (() => flatPlcList)
        const oldColumnFilterDataMap = state.columnFilterDataMap
        state.columnFilterDataMap = flatPlcList.reduce((prev, plc) => {
            const key = getColumnKey(plc)
            const oldColumnFilterData = oldColumnFilterDataMap[key]
            prev[key] = !!oldColumnFilterData ? {...oldColumnFilterData} : {
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

    /*查询的时候被收集筛选条件*/
    hooks.onCollectFilterData.use((data) => {

        /*普通筛选条件*/
        const ftoArr = Object.values(columnFilterTargetDataMap.value).map(i => i.fto).filter(Boolean) as iFilterTargetOption[]
        const queries = ftoArr.reduce((prev, fto) => {
            const queries = fto.handler.transform(fto)
            if (!!queries) {
                prev.push(...toArray(queries))
            }
            return prev
        }, [] as iFilterQuery[])

        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    hooks.onClickHead.use(({plc, e}) => {
        /*分组表头不做处理, 仅处理列表头*/
        if (plc.group || !plc.props.field) {return}
        const menuOpt: ContextmenuServiceOption = {} as any

        $contextmenu(e.currentTarget, () => {
            const columnKey = getColumnKey(plc)
            const columnFilterTargetData = columnFilterTargetDataMap.value[columnKey]
            if (!columnFilterTargetData) {return;}

            const {fto} = columnFilterTargetData
            const {field, label: title} = fto!.option
            const {desc} = tableSort.get({field, title}) || {desc: null}

            return <>
                <div onClick={e => e.stopPropagation()} className="pro-column-filter-container">
                    <div className="pro-column-filter-sort-container">
                        <div className={classnames([
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !desc}
                        ])} onClick={() => tableSort.toggleSort({field, desc: false, title})}>
                            <PlIcon icon="el-icon-upload1"/>
                            <span>升序</span>
                        </div>
                        <div className={classnames([
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !!desc}
                        ])} onClick={() => tableSort.toggleSort({field, desc: true, title})}>
                            <PlIcon icon="el-icon-download"/>
                            <span>降序</span>
                        </div>
                    </div>
                    <div>
                        <PlFilter block fto={fto} hideSearchButton onConfirm={methods.pageMethods.reload}/>
                    </div>
                    <div>
                        <PlButtonGroup>
                            <PlButton mode="stroke" icon="el-icon-thumb" label="关闭" onClick={() => menuOpt.hide!()}/>
                            <PlButton icon="el-icon-s-tools" label="应用" onClick={() => methods.pageMethods.reload()}/>
                            <PlButton icon="el-icon-search" label="去重筛选" onClick={() => {
                                menuOpt.hide!()
                                distinct.open(columnFilterTargetData)
                            }}/>
                            <PlButton icon="el-icon-close" onClick={() => distinct.clear(columnFilterTargetData)}/>
                        </PlButtonGroup>
                    </div>
                </div>
            </>
        }, menuOpt)
    })

    return {
        state,
    }
}
