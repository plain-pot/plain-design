import {computed, designComponent, onMounted, PropType} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import PlTable from "../PlTable";
import './table-pro.scss'
import PlButton from "../PlButton";
import PlDropdown from "../PlDropdown";
import PlDropdownMenu from "../PlDropdownMenu";
import PlIcon from "../PlIcon";
import PlButtonGroup from "../PlButtonGroup";
import {TableNode} from "../PlTable/table/use/useTableNode";
import {PlcIndex} from "../PlcIndex";
import {toArray} from "../../utils/toArray";
import {tPlcType} from "../PlTable/plc/utils/plc.type";

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
            onClickHead: (plc: tPlcType, e: React.MouseEvent) => props.option.hooks.onClickHead.exec({plc, e})
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
                    {props.option.filter.searchFilter.render()}
                    <div className="pl-table-pro-operation">
                        {props.option.hooks.onButtons.exec(
                            <PlButtonGroup>
                                {props.option.buttons.btns.insert.button()}
                                {props.option.buttons.btns.copy.button()}
                                {props.option.buttons.btns.delete.button()}
                                <PlDropdown placement="bottom-end" width="190" height={null as any}>
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
                                            {props.option.buttons.btns.editForm.dropdown()}
                                            {props.option.buttons.btns.batchInsert.dropdown()}
                                            {props.option.buttons.btns.batchUpdate.dropdown()}
                                            {props.option.buttons.btns.batchDelete.dropdown()}
                                            {props.option.buttons.btns.batchModify.dropdown()}
                                            {props.option.buttons.btns.seniorFilter.dropdown()}
                                            {props.option.buttons.btns.seniorSort.dropdown()}
                                            {props.option.buttons.btns.setting.dropdown()}
                                            {props.option.buttons.btns.importData.dropdown()}
                                            {props.option.buttons.btns.exportData.dropdown()}
                                        </PlDropdownMenu>
                                    }}
                                </PlDropdown>
                            </PlButtonGroup>
                        )}
                    </div>
                </div>
                {props.option.filter.formFilter.render()}
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
                    onClickHead={handler.onClickHead}
                    sort={props.option.sortData.value}
                    onCollectPlcData={props.option.hooks.onCollectPlcData.exec}
                >
                    <PlcIndex start={props.option.pagination.pageState.page * props.option.pagination.pageState.size}/>
                    {props.option.hooks.onColumns.exec(slots.default())}
                </PlTable>
                {props.option.pagination.render()}
            </div>
        )
    },
})

export default PlTablePro