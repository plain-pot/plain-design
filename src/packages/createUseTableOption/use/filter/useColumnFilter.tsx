import {tTableOptionHooks} from "../use.hooks";
import {classnames, computed} from "plain-design-composition";
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
import {useTableOptionDistinctFilter} from "./useDistinctFilter";
import {iTableProConfig} from "../../createUseTableOption.utils";
import PlButtonGroup from "../../../PlButtonGroup";
import {tTableOptionSort} from "../use.sort.state";
import {tTableOptionFilter} from "../use.filter.state";

type iFilterStateDataMap = Record<string, iFilterOption>
type iFilterCacheData = Omit<iFilterOption, 'filterConfig' | 'plc'>
type iFilterCacheDataMap = Record<string, iFilterCacheData>

export function useTableOptionColumnFilter({hooks, methods, customConfig, sortState, filterState}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, sortState: tTableOptionSort, filterState: tTableOptionFilter }) {

    const distinct = useTableOptionDistinctFilter({customConfig, methods, hooks})

    const $contextmenu = useContextmenu()

    const getColumnKey = (plc: tPlc) => plc.props.field! + (plc.props.title || '#_#')

    const data = filterState.useState<iFilterStateDataMap, iFilterCacheDataMap>({
        key: 'column-filter',
        title: '列查询',
        state: {},
        onReady: (flatPlcList, cacheData) => {
            const oldData = data.state as iFilterStateDataMap
            data.state = flatPlcList.reduce((prev, plc) => {
                const key = getColumnKey(plc)
                if (!!oldData[key]) {
                    prev[key] = {...oldData[key]}
                } else {
                    if (!!cacheData && !!cacheData[key]) {
                        prev[key] = {
                            ...cacheData[key],
                            filterConfig: plc.props.filterConfig,
                            plc,
                        }
                    } else {
                        prev[key] = {
                            label: plc.props.title!,
                            field: plc.props.field!,
                            value: null,
                            filterName: plc.props.filterName,
                            handlerName: plc.props.filterHandler,
                            filterConfig: plc.props.filterConfig,
                            plc,
                        }
                    }
                }
                return prev
            }, {} as Record<string, iFilterOption>)
        },
        getActiveFilterCount: (): number => {
            return Object.values(columnFilterTargetDataMap.value).reduce((prev, fto) => {
                const queries = FilterConfig.formatToQuery(fto)
                return prev + (!!queries && toArray(queries).length > 0 ? 1 : 0)
            }, 0)
        },
        display: () => <>
            显示列筛选内容
        </>,
        clear: () => {
            Object.values(data.state as iFilterStateDataMap).forEach(i => {
                i.value = undefined
                i.filterName = i.plc!.props.filterName
            })
        },
        getCacheData: () => {
            const s: iFilterStateDataMap = data.state as any
            return Object.entries(s).reduce((prev, [key, {filterConfig, plc, ...left}]) => {
                prev[key] = left
                return prev
            }, {} as iFilterCacheDataMap)
        },
    })

    /*列目标筛选配置信息对象*/
    const columnFilterTargetDataMap = computed(() => Object.entries(data.state).reduce((prev, [columnKey, option]) => {
        const fto = FilterConfig.getTargetOption(option)
        !!fto && (prev[columnKey] = fto)
        return prev
    }, {} as Record<string, iFilterTargetOption>))

    /*查询的时候被收集筛选条件*/
    hooks.onCollectFilterData.use((data) => {

        /*普通筛选条件*/
        const ftoArr = Object.values(columnFilterTargetDataMap.value)
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
            const fto = columnFilterTargetDataMap.value[columnKey]
            if (!fto) {return;}

            const {field, label: title} = fto.option
            const {desc} = sortState.get({field, title}) || {desc: null}

            return <>
                <div onClick={e => e.stopPropagation()} className="pro-column-filter-container">
                    <div className="pro-column-filter-sort-container">
                        <div className={classnames([
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !desc}
                        ])} onClick={() => sortState.toggleSort({field, desc: false, title})}>
                            <PlIcon icon="el-icon-upload1"/>
                            <span>升序</span>
                        </div>
                        <div className={classnames([
                            'pro-column-filter-sort-item',
                            {'pro-column-filter-sort-item-active': desc !== null && !!desc}
                        ])} onClick={() => sortState.toggleSort({field, desc: true, title})}>
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
                                distinct.open(fto)
                            }}/>
                            <PlButton icon="el-icon-close" onClick={() => distinct.clear(fto)}/>
                        </PlButtonGroup>
                    </div>
                </div>
            </>
        }, menuOpt)
    })
}
