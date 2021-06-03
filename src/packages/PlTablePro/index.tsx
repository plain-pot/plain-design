import {computed, designComponent, onMounted, PropType} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import PlTable from "../PlTable";
import './table-pro.scss'
import PlButton from "../PlButton";
import PlDropdown from "../PlDropdown";
import PlDropdownMenu from "../PlDropdownMenu";
import PlDropdownOption from "../PlDropdownOption";
import PlIcon from "../PlIcon";
import PlButtonGroup from "../PlButtonGroup";
import {TableNode} from "../PlTable/table/use/useTableNode";
import {PlcIndex} from "../PlcIndex";
import {eTableProEditType} from "../createUseTableOption/createUseTableOption.utils";

export const PlTablePro = designComponent({
    props: {
        option: {type: Object as PropType<tTableOption>, required: true},
        loading: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        onMounted(() => {
            if (props.option.config.loadOnStart !== false) {
                props.option.pageMethods.reload()
            }
        })

        const refTable = (table: typeof PlTable.use.class | null | undefined) => {
            props.option.hooks.onRefTable.exec(table!)
        }

        const handler = {
            onClickCell: (node: TableNode) => {props.option.hooks.onClickCell.exec(node)},
            onDblClickCell: (node: TableNode) => {props.option.hooks.onDblClickCell.exec(node)},
        }

        const loading = computed(() => {
            if (props.loading) {return true}
            return props.option.hooks.onLoading.exec(false)
        })

        return () => (
            <div className="pl-table-pro">
                <div className="pl-table-pro-head">
                    <span className="pl-table-pro-title">
                        <PlIcon icon="el-icon-menu" status="primary"/>
                        <span>{props.option.config.title}</span>
                    </span>
                    <div className="pl-table-pro-operation">
                        {props.option.tableState.isEditing ? <>
                                <PlButton label={'取消'} icon="el-icon-close-bold" mode="stroke" onClick={() => props.option.editMethods.cancel()}/>
                                <PlButton label={'保存'} icon="el-icon-check-bold" onClick={() => props.option.editMethods.save()}/>
                            </> :
                            <PlButtonGroup>
                                <PlButton label={'新建'} icon="el-icon-document-add" onClick={() => props.option.editMethods.insert()}/>
                                <PlButton label={'复制'} icon="el-icon-document-copy" onClick={() => props.option.editMethods.copy()}/>
                                <PlButton label={'删除'} icon="el-icon-document-remove" onClick={() => props.option.editMethods.delete()}/>
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
                                            <PlDropdownOption label="批量新建" icon="el-icon-document-add" onClick={props.option.editMethods.batchInsert}/>
                                            <PlDropdownOption label="批量编辑" icon="el-icon-edit-outline" onClick={props.option.editMethods.batchUpdate}/>
                                            <PlDropdownOption label="表单编辑" icon="el-icon-document" onClick={() => props.option.editMethods.update(undefined, eTableProEditType.form)}/>
                                            <PlDropdownOption label="批量修改" icon="el-icon-edit"/>
                                            <PlDropdownOption label="高级筛选" icon="el-icon-brush"/>
                                            <PlDropdownOption label="高级排序" icon="el-icon-sort"/>
                                            <PlDropdownOption label="个性设置" icon="el-icon-setting"/>
                                            <PlDropdownOption label="导入数据" icon="el-icon-download"/>
                                            <PlDropdownOption label="导出数据" icon="el-icon-upload1"/>
                                        </PlDropdownMenu>
                                    }}
                                </PlDropdown>
                            </PlButtonGroup>}
                    </div>
                </div>
                <PlTable
                    ref={refTable}
                    data={props.option.tableState.list}
                    defaultEditingWhenAddRow={props.option.tableState.editingWhenAddRow}
                    loading={!!loading.value}
                    currentKey={props.option.tableState.currentKey || undefined}
                    onUpdateCurrentKey={val => props.option.tableState.currentKey = val || null}
                    keyField={props.option.config.keyField}
                    onClickRow={handler.onClickCell}
                    onDblclickCell={handler.onDblClickCell}
                >
                    <PlcIndex start={props.option.pagination.pageState.page * props.option.pagination.pageState.size}/>
                    {slots.default()}
                </PlTable>
                {props.option.pagination.render()}
            </div>
        )
    },
})

export default PlTablePro