import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {computed, reactive} from "plain-design-composition";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import PlButton from "../../../PlButton";
import PlDropdown from "../../../PlDropdown";
import {tTableOptionHooks} from "../use.hooks";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlIcon from "../../../PlIcon";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {createFilterOptionByPlc} from "../filter/use.filter.utils";
import PlFilter from "../../../PlFilter";
import {tTableOptionMethods} from "../use.methods";
import './use.setting.filter.senior.scss'
import PlCheckbox from "../../../PlCheckbox";
import PlInput from "../../../PlInput";
import PlTable from "../../../PlTable";
import {PlcIndex} from "../../../PlcIndex";
import {Plc} from "../../../Plc";
import {toArray} from "../../../../utils/toArray";

interface iSeniorFilterData extends iFilterOption {
    id: string
}

interface iSeniorFilterTargetData extends Omit<iFilterTargetOption, 'option'> {
    option: iSeniorFilterData,
}

const ExpressionJoins = ['&&', '||', 'and', 'or', '并且', '或者']

export function useTableOptionSettingSeniorFilter(
    {
        useTableOptionSettingInner,
        hooks,
        getSourceFlatPlcList,
        methods,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        hooks: tTableOptionHooks,
        getSourceFlatPlcList: () => tPlc[],
        methods: tTableOptionMethods,
    }) {

    const DEFAULT_EXPRESSION_JOIN = '或者'

    const state = reactive({
        data: [] as iSeniorFilterData[],
        expression: null as null | string,
        customExpression: false,
    })

    const defaultExpression = computed(() => state.data.map(i => i.id).join(` ${DEFAULT_EXPRESSION_JOIN} `))

    const utils = {
        nextId: (() => {
            let count = 1
            return () => `F_${count++}`
        })(),
        resetOperator: () => {
            state.expression = defaultExpression.value
        },
    }

    const handler = {
        add: (plc: tPlc) => {

            const id = utils.nextId()

            if (state.data.length === 0) {
                state.expression = id
            } else {
                state.expression += ` ${DEFAULT_EXPRESSION_JOIN} ${id}`
            }

            state.data.push({id, ...createFilterOptionByPlc(plc)})
        },
        remove: (fto: iFilterTargetOption, index: number) => {
            const isMatchDefaultOperator = !!state.expression && state.expression.trim() === defaultExpression.value
            state.data.splice(index, 1)
            if (isMatchDefaultOperator) {state.expression = defaultExpression.value}
        },
        apply: () => {
            methods.pageMethods.reload()
        },
        clear: () => {
            state.data = []
            state.expression = null
        },
    }

    const ftoArr = computed(() => state.data.map(i => FilterConfig.getTargetOption(i)).filter(Boolean) as iSeniorFilterTargetData[])

    useTableOptionSettingInner({
        key: eTableOptionSettingView.seniorFilter,
        title: '高级筛选',
        seq: 1,
        render: () => <>
            <div className="pl-table-pro-setting-senior-filter">
                <div className="pl-table-pro-setting-senior-filter-button">
                    <div>
                        <PlButton label="应用" onClick={handler.apply}/>
                        <PlDropdown>
                            {{
                                reference: ({open}) => (
                                    <PlButton style={{marginBottom: '16px'}}>
                                        <span>新增筛选</span>
                                        <PlIcon icon={'el-icon-arrow-down'} style={{transition: 'transform 200ms linear', transform: `rotateX(${open ? 180 : 0}deg)`,}}/>
                                    </PlButton>
                                ),
                                popper: <PlDropdownMenu>
                                    {getSourceFlatPlcList().filter(i => !!i.props.field && !!i.props.title).map((plc, index) => (
                                        <PlDropdownOption label={plc.props.title} key={index} onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            handler.add(plc)
                                        }}/>
                                    ))}
                                </PlDropdownMenu>
                            }}
                        </PlDropdown>
                        <PlCheckbox label="自定义查询表达式" v-model={state.customExpression} onChange={utils.resetOperator}/>
                    </div>
                    <PlButton label="清空" mode="stroke" status="error" onClick={handler.clear}/>
                </div>
                <div className="pl-table-pro-setting-senior-filter-list">

                    <PlTable data={ftoArr.value} showRows={Math.max(5, ftoArr.value.length)}>
                        <PlcIndex/>
                        <Plc title="编号" width="80" align="center">
                            {{normal: ({row}) => row.option.id}}
                        </Plc>
                        <Plc title="标题" width="100" align="center">
                            {{normal: ({row}) => row.option.label}}
                        </Plc>
                        <Plc title="查询条件" fit>
                            {{
                                normal: ({node}) => (
                                    <PlFilter
                                        fto={node.data as any}
                                        key={node.data.filter.filterName + node.data.handler.handlerName}
                                        hideSearchButton
                                        block
                                    />
                                )
                            }}
                        </Plc>
                        <Plc width="50">
                            {{
                                normal: ({node}) => <PlButton label="删除" mode="text" status="error" onClick={() => handler.remove(node.data as any, node.index)}/>
                            }}
                        </Plc>
                    </PlTable>
                </div>
                <div>
                    <h3>自定义表达式 :</h3>
                    <PlInput textarea v-model={state.expression} block disabled={!state.customExpression}/>
                </div>
            </div>
        </>
    })

    hooks.onCollectFilterData.use((prev) => {
        if (state.data.length === 0) {return prev}
        let expression = !state.customExpression || !state.expression ? defaultExpression.value : state.expression
        /*处理空格*/
        expression = expression.replace(/\s*(\|\||&&|或者|并且)\s*/gi, ' $1 ').replace(/\s+/, ' ')

        const queries: iFilterQuery[] = []
        const id2Senior = ftoArr.value.reduce((prev, item) => {
            prev[item.option.id] = item
            return prev
        }, {} as Record<string, iSeniorFilterTargetData | undefined>)
        expression = expression.replace(/\w+/g, (input) => {

            if (ExpressionJoins.indexOf(input) > -1) {return input}

            const senior = id2Senior[input]
            if (!senior) {return input}

            let itemQueries = FilterConfig.formatToQuery(senior)
            if (!itemQueries) {return input}

            if (!Array.isArray(itemQueries)) {
                itemQueries.id = input
                queries.push(itemQueries)
                return input
            }
            if (itemQueries.length === 1) {
                itemQueries[0].id = input
                queries.push(...itemQueries)
                return input
            }

            const itemQueryIds: string[] = []
            toArray(itemQueries).forEach((i, idx) => {
                const itemId = `${input}-${idx + 1}`
                itemQueryIds.push(itemId)
                queries.push({
                    ...i,
                    id: itemId,
                })
            })

            return `(${itemQueryIds.join(' 并且 ')})`
        })

        return [...prev, {queries, expression: expression}]
    })
}
