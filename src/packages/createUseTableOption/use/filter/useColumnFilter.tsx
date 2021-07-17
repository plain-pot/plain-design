import {tTableOptionHooks} from "../use.hooks";
import {classnames, computed, reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import useContextmenu from "../../../useContextmenu";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import PlButton from "../../../PlButton";
import './column.filter.scss'
import PlFilter from "../../../PlFilter";
import PlIcon from "../../../PlIcon";
import {toArray} from "../../../../utils/toArray";
import {ContextmenuServiceOption} from "../../../useContextmenu/PlContextMenuService";
import {useDistinctFilter} from "./useDistinctFilter";
import {iTableProConfig} from "../../createUseTableOption.utils";

interface ColumnFilterData {
    desc: null | boolean,
    sortIndex: null | number,                   // 每次对某个字段进行排序，都会变成最高优先级的排序功能
    option: iFilterOption,
    distinctFilterValues: null | string[],
}

interface ColumnFilterTargetData extends ColumnFilterData {
    fto?: iFilterTargetOption,
    sourceData: () => ColumnFilterData,
}

const MAX_SORT_INDEX = 100

let excludePlcListWhenCollectFilterData: tPlc[] = []

export function useColumnFilter({hooks, methods, customConfig}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig }) {

    const distinct = useDistinctFilter()

    const $contextmenu = useContextmenu()

    const getColumnKey = (plc: tPlc) => plc.props.field! + (plc.props.title || '#_#')

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        columnFilterDataMap: {} as Record<string, ColumnFilterData>,
        distinctFilterValueMap: new Map<tPlc, (string | number)[]>(),
    })

    const columnFilterTargetDataMap = computed(() => Object.entries(state.columnFilterDataMap).reduce((prev, [columnKey, cfd]) => {
        prev[columnKey] = {
            ...cfd,
            fto: FilterConfig.getTargetOption(cfd.option),
            sourceData: () => cfd,
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
                sortIndex: null,
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

    hooks.onCollectFilterData.use((data) => {
        const ftoArr = Object.values(columnFilterTargetDataMap.value).map(i => i.fto).filter(Boolean) as iFilterTargetOption[]
        const queries = ftoArr.reduce((prev, fto) => {
            const queries = fto.handler.transform(fto)
            if (!!queries) {
                prev.push(...toArray(queries))
            }
            return prev
        }, [] as iFilterQuery[])

        Array.from(state.distinctFilterValueMap.entries()).forEach(([plc, distinctValues]) => {
            if (distinctValues.length === 0 || excludePlcListWhenCollectFilterData.indexOf(plc) > -1) {return}
            queries.push({field: plc.props.field!, operator: 'in', value: distinctValues,})
        })

        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    const minSortIndex = computed(() => Object.values(state.columnFilterDataMap).reduce((prev, item) => Math.min(prev, item.sortIndex || MAX_SORT_INDEX), MAX_SORT_INDEX))

    const changeSort = (cftd: ColumnFilterTargetData, desc: boolean) => {
        const cfd = cftd.sourceData()
        if (cfd.desc == null || cfd.desc !== desc) {
            cfd.desc = desc
            cfd.sortIndex = minSortIndex.value - 1
        } else {
            cfd.desc = null
            cfd.sortIndex = null
        }
        methods.pageMethods.reload()
    }

    hooks.onCollectSortData.use((prev) => {
        const sortData = Object.values(columnFilterTargetDataMap.value)
            .filter(i => !!i.option.field && i.sortIndex != null && i.desc != null)
            .map(i => ({field: i.option.field, desc: i.desc, sortIndex: i.sortIndex}))
            .sort((a, b) => -(a.sortIndex! - b.sortIndex!)) as { field: string, desc: boolean, sortIndex: number }[]
        if (sortData.length === 0) {return prev}
        return [...(sortData.map(i => ({field: i.field, desc: i.desc}))), ...prev,]
    })

    const openDistinctFilterDialog = async (cftd: ColumnFilterTargetData) => {
        const field = cftd.fto!.option.field
        const plc = cftd.fto!.option.plc
        if (!field || !plc) {return console.warn('distinct filter: no field or plc!')}

        excludePlcListWhenCollectFilterData.push(plc)
        const existFilterDataExcludePlcDistinctFilterValue = await hooks.onCollectFilterData.exec([])
        excludePlcListWhenCollectFilterData.splice(0, 1)

        const distinctValues = await distinct.pick({plc, customConfig, existFilterDataExcludePlcDistinctFilterValue})
        if (distinctValues.length === 0) {
            state.distinctFilterValueMap.delete(plc)
        } else {
            state.distinctFilterValueMap.set(plc, distinctValues)
        }
        methods.pageMethods.reload()
    }

    hooks.onClickHead.use(({plc, e}) => {
        /*分组表头不做处理, 仅处理列表头*/
        if (plc.group || !plc.props.field) {return}
        const menuOpt: ContextmenuServiceOption = {} as any

        $contextmenu(e.currentTarget, () => {
            const columnKey = getColumnKey(plc)
            const columnFilterTargetData = columnFilterTargetDataMap.value[columnKey]
            if (!columnFilterTargetData) {return;}

            const {fto, desc} = columnFilterTargetData

            return <>
                <div onClick={e => e.stopPropagation()} className="pro-column-filter-container">
                    <div className="pro-column-filter-sort-container">
                        <div className={classnames([
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !desc}
                        ])} onClick={() => changeSort(columnFilterTargetData, false)}>
                            <PlIcon icon="el-icon-upload1"/>
                            <span>升序</span>
                        </div>
                        <div className={classnames([
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !!desc}
                        ])} onClick={() => changeSort(columnFilterTargetData, true)}>
                            <PlIcon icon="el-icon-download"/>
                            <span>降序</span>
                        </div>
                    </div>
                    <div>
                        <PlFilter block fto={fto} hideSearchButton onConfirm={methods.pageMethods.reload}/>
                    </div>
                    <div>
                        <PlButton mode="stroke" icon="el-icon-thumb" label="关闭" onClick={() => menuOpt.hide!()}/>
                        <PlButton icon="el-icon-s-tools" label="应用" onClick={() => methods.pageMethods.reload()}/>
                        <PlButton icon="el-icon-search" label="去重筛选" onClick={() => openDistinctFilterDialog(columnFilterTargetData)}/>
                    </div>
                </div>
            </>
        }, menuOpt)
    })

    return {
        state,
    }
}
