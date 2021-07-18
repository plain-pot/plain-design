import {designComponent, PropType, useModel} from "plain-design-composition";
import PlDropdown from "../../../../PlDropdown";
import PlButton from "../../../../PlButton";
import PlIcon from "../../../../PlIcon";
import PlDropdownMenu from "../../../../PlDropdownMenu";
import PlDropdownOption from "../../../../PlDropdownOption";
import PlTable from "../../../../PlTable";
import {PlcIndex} from "../../../../PlcIndex";
import {PlcDraggier} from "../../../../PlcDraggier";
import {Plc} from "../../../../Plc";
import PlToggle from "../../../../PlToggle";
import React from "react";
import {tPlc} from "../../../../PlTable/plc/utils/plc.type";
import {iTableOptionSortData, tTableOptionSort} from "../../use.sort";

export const TableOptionSettingSort = designComponent({
    props: {
        modelValue: {type: Array as PropType<iTableOptionSortData[]>},
        getConfig: {type: Function as PropType<() => { plcList: tPlc[], tableSort: tTableOptionSort }>, required: true},
    },
    emits: {
        onUpdateModelValue: (val?: iTableOptionSortData[]) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const {plcList, tableSort} = props.getConfig()

        const handler = {
            add: ({title, field}: Omit<iTableOptionSortData, 'seq'>) => {
                model.value = [...(model.value || []), {title, field, desc: true, seq: tableSort.seqData.value.min}]
            },
            remove: (data: Omit<iTableOptionSortData, 'seq'>) => {
                model.value = model.value!.filter(({title, field}) => title !== data.title && field !== data.field)
            },
            apply: () => {
                tableSort.setSort(model.value || [])
            },
        }

        return () => (
            <div>
                <div className="pl-table-pro-setting-content-header">
                    <PlDropdown>
                        {{
                            reference: ({open}) => (
                                <PlButton style={{marginBottom: '16px'}}>
                                    <span>新增排序字段</span>
                                    <PlIcon icon={'el-icon-arrow-down'} style={{transition: 'transform 200ms linear', transform: `rotateX(${open ? 180 : 0}deg)`,}}/>
                                </PlButton>
                            ),
                            popper: <PlDropdownMenu>
                                {plcList.filter(i => !!i.props.field && !!i.props.title).map((plc, index) => (
                                    <PlDropdownOption label={plc.props.title} key={index} onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        handler.add({field: plc.props.field!, title: plc.props.title!, desc: true})
                                    }}/>
                                ))}
                            </PlDropdownMenu>
                        }}
                    </PlDropdown>
                    <PlButton label="应用" onClick={handler.apply}/>
                </div>
                <PlTable v-model-data={model.value} showRows={(model.value || []).length}>
                    <PlcIndex/>
                    <PlcDraggier/>
                    <Plc title="排序字段" field="title"/>
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
                                <PlButton label="删除" mode="text" status="error" onClick={() => handler.remove(node.data as any)}/>
                            )
                        }}
                    </Plc>
                </PlTable>
            </div>
        )
    },
})