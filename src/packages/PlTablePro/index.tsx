import {designComponent, onMounted, PropType} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import PlTable from "../PlTable";
import './table-pro.scss'
import Plc from "../Plc";
import PlButton from "../PlButton";
import PlDropdown from "../PlDropdown";
import PlDropdownMenu from "../PlDropdownMenu";
import PlDropdownOption from "../PlDropdownOption";
import PlIcon from "../PlIcon";
import PlButtonGroup from "../PlButtonGroup";

export const PlTablePro = designComponent({
    props: {
        option: {type: Object as PropType<tTableOption>, required: true},
    },
    slots: ['default'],
    setup({props, slots}) {

        onMounted(() => {
            if (props.option.config.loadOnStart !== false) {
                props.option.methods.reload()
            }
        })

        return () => (
            <div className="pl-table-pro">
                <div className="pl-table-pro-head">
                    <span className="pl-table-pro-title">
                        <PlIcon icon="el-icon-menu" status="primary"/>
                        <span>{props.option.config.title}</span>
                    </span>
                    <div className="pl-table-pro-operation">
                        <PlButtonGroup size="mini">
                            <PlButton label={'新建'} icon="el-icon-document-add"/>
                            <PlButton label={'复制'} icon="el-icon-document-copy"/>
                            <PlButton label={'删除'} icon="el-icon-document-remove"/>
                            <PlDropdown placement="bottom-end" width="100">
                                {{
                                    reference: ({open}) => (
                                        <PlButton>
                                            <span>更多</span>
                                            <PlIcon icon={'el-icon-arrow-down'} style={{
                                                transition: 'transform 200ms linear',
                                                transform: `rotateX(${open ? 180 : 0}deg)`,
                                            }}/>
                                        </PlButton>
                                    ),
                                    popper: <PlDropdownMenu>
                                        <PlDropdownOption label="批量新建" icon="el-icon-document-add"/>
                                        <PlDropdownOption label="批量编辑" icon="el-icon-edit-outline"/>
                                        <PlDropdownOption label="批量修改" icon="el-icon-edit"/>
                                        <PlDropdownOption label="表单编辑" icon="el-icon-document"/>
                                        <PlDropdownOption label="高级筛选" icon="el-icon-brush"/>
                                        <PlDropdownOption label="高级排序" icon="el-icon-sort"/>
                                        <PlDropdownOption label="个性设置" icon="el-icon-setting"/>
                                        <PlDropdownOption label="导入数据" icon="el-icon-download"/>
                                        <PlDropdownOption label="导出数据" icon="el-icon-upload1"/>
                                    </PlDropdownMenu>
                                }}
                            </PlDropdown>
                        </PlButtonGroup>
                    </div>
                </div>
                <PlTable
                    data={props.option.tableState.list}
                    defaultEditingWhenAddRow={props.option.tableState.editingWhenAddRow}>
                    <Plc.PlcIndex start={props.option.pagination.pageState.page * props.option.pagination.pageState.size}/>
                    {slots.default()}
                </PlTable>
                {props.option.pagination.render()}
            </div>
        )
    },
})

export default PlTablePro