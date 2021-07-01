import {classnames, designComponent, PropType, reactive} from "plain-design-composition";
import React from "react";
import './TableOptionSetting.scss'
import PlTable from "../../../PlTable";
import {Plc} from "../../../Plc";
import {PlcDraggier} from "../../../PlcDraggier";
import {PlcIndex} from "../../../PlcIndex";
import PlToggle from "../../../PlToggle";
import PlDropdown from "../../../PlDropdown";
import PlButton from "../../../PlButton";
import PlIcon from "../../../PlIcon";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {iTableSortData} from "../../createUseTableOption.utils";
import {deepcopy} from "plain-utils/object/deepcopy";
import {toArray} from "../../../../utils/toArray";

export enum eTableOptionSettingView {
    filter = 'filter',
    sort = 'sort',
    config = 'config',
    import = 'import',
    export = 'export',
}

export default designComponent({
    props: {
        initView: {type: String as PropType<eTableOptionSettingView>, required: true},
        plcList: {type: Array as PropType<tPlc[]>, required: true},
        sortData: {type: Array as PropType<iTableSortData | iTableSortData[]>, required: true},
    },
    emits: {
        onApplySort: (sorts: iTableSortData[]) => true,
    },
    setup({props, event: {emit}}) {

        const state = reactive({
            view: props.initView,
        })

        const sortState = reactive({
            data: deepcopy(toArray(props.sortData).map(i => ({
                ...i,
                desc: i.desc !== false,
                label: (() => {
                    const plc = props.plcList.find(plc => plc.props.field === i.field)
                    let label = !plc ? null : plc.props.title
                    if (!label) {
                        if (i.field === 'createdAt') {label = '创建时间'}
                        if (i.field === 'updatedAt') {label = '更新时间'}
                    }
                    return label
                })(),
            }))).filter(i => !!i.label),
            apply: () => {
                emit.onApplySort(sortState.data)
            }
        })

        const renderer = [
            {},
            {
                title: '高级筛选',
                view: eTableOptionSettingView.filter,
                render: () => {
                    return '==>>高级筛选'
                },
            },
            {
                title: '高级排序',
                view: eTableOptionSettingView.sort,
                render: () => {
                    return (
                        <div>
                            <div className="pl-table-pro-setting-content-header">
                                <PlDropdown>
                                    {{
                                        reference: ({open}) => (
                                            <PlButton style={{marginBottom: '16px'}}>
                                                <span>新增排序字段</span>
                                                <PlIcon icon={'el-icon-arrow-down'} style={{
                                                    transition: 'transform 200ms linear',
                                                    transform: `rotateX(${open ? 180 : 0}deg)`,
                                                }}/>
                                            </PlButton>
                                        ),
                                        popper: <PlDropdownMenu>
                                            {props.plcList.filter(i => !!i.props.field && !!i.props.title).map((plc, index) => (
                                                <PlDropdownOption label={plc.props.title} key={index} onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    sortState.data.push({
                                                        field: plc.props.field!,
                                                        label: plc.props.title!,
                                                        desc: true,
                                                    })
                                                }}/>
                                            ))}
                                        </PlDropdownMenu>
                                    }}
                                </PlDropdown>
                                <PlButton label="应用" onClick={sortState.apply}/>
                            </div>

                            <PlTable v-model-data={sortState.data} showRows={sortState.data.length}>
                                <PlcIndex/>
                                <PlcDraggier/>
                                <Plc title="排序字段" field="label"/>
                                <Plc title="排序方式" field="desc">
                                    {{
                                        normal: ({row}) => (
                                            <div>
                                                <PlToggle v-model={row.desc} size="mini"/>
                                                <span style={{marginLeft: '4px'}}>{row.desc ? '降序' : '升序'}</span>
                                            </div>
                                        )
                                    }}
                                </Plc>
                                <Plc align="center">
                                    {{
                                        normal: ({node}) => (
                                            <PlButton label="删除" mode="text" status="error" onClick={() => sortState.data.splice(node.index, 1)}/>
                                        )
                                    }}
                                </Plc>
                            </PlTable>

                        </div>
                    )
                },
            },
            {
                title: '个性设置',
                view: eTableOptionSettingView.config,
                render: () => {
                    return '==>> 个性设置'
                },
            },
            {
                title: '导入数据',
                view: eTableOptionSettingView.import,
                render: () => {
                    return '==>> 导入数据'
                },
            },
            {
                title: '导出数据',
                view: eTableOptionSettingView.export,
                render: () => {
                    return '==>> 导出数据'
                },
            },
            {},
        ]


        return () => (
            <div className="pl-table-pro-setting">
                <div className="pl-table-pro-setting-nav">
                    {renderer.map((item, index) => (
                        <div className={classnames([
                            'pl-table-pro-setting-nav-item',
                            {
                                'pl-table-pro-setting-nav-item-active': item.view === state.view,
                                'pl-table-pro-setting-nav-item-prev': !!renderer[index + 1] && renderer[index + 1].view === state.view,
                                'pl-table-pro-setting-nav-item-next': !!renderer[index - 1] && renderer[index - 1].view === state.view,
                            }
                        ])} key={index} onClick={() => !!state.view && (state.view = item.view!)}>
                            <div className="pl-table-pro-setting-nav-item-inner">
                                {item.title}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pl-table-pro-setting-content">
                    {(() => {
                        const r = renderer.find(i => i.view === state.view)
                        return !!r && !!r.render && r.render()
                    })()}
                </div>
            </div>
        )
    },
})