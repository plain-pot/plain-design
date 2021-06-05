import {computed, designComponent, onBeforeUnmount, PropType, reactive, useRefs} from "plain-design-composition";
import {PlainObject, tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import React from "react";
import {eTableProStatus, tTableOptionConfirm} from "./use.confirm";
import {createPlcPropOptions, PlcEmitsOptions} from "../../PlTable/plc/utils/plc.utils";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {PlcScopeSlotsOptions} from "../../PlTable/plc/utils/plc.scope-slots";
import {injectPlainTable} from "../../PlTable";
import {CheckboxStatus} from "../../../utils/constant";
import {useExternalPlc} from "../../PlTable/plc/core/useExternalPlc";
import {PlCheckbox} from "../../PlCheckbox";
import PlDropdown from "../../PlDropdown";
import PlDropdownMenu from "../../PlDropdownMenu";
import PlDropdownOption from "../../PlDropdownOption";
import {defer} from "../../../utils/defer";
import useMessage from "../../useMessage";

const PlcProCheck = designComponent({
    name: 'plc-pro-check',
    props: {
        ...createPlcPropOptions({
            autoFixedLeft: true,
            order: -9998,
            width: 40,
            align: 'center',
            noPadding: true,
            hideInForm: true,
        }),
        toggleOnClickRow: {type: Boolean},                                          // 是否在点击行的时候触发点击动作
        isCheckable: {type: Function as PropType<(node: TableNode) => boolean>},    // 是否可选
        keyField: {type: String, required: true},                                   // 行标识字段
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event}) {

        const table = injectPlainTable()
        const state = reactive({
            /*当前选中行数组*/
            selectedRows: [] as PlainObject[],
        })
        /*获取对象的key*/
        const getKey = (row: any) => row[props.keyField]
        /*选中行数组的key数组*/
        const selectedKeys = computed(() => state.selectedRows.map(row => getKey(row)))
        /*当前状态，全选，全不选还是半选*/
        const status = computed(() => {
            let hasCheck = null as null | boolean;
            let hasUncheck = null as null | boolean;

            table.flatNodes.value.forEach(node => {
                const key = getKey(node.data)
                if (selectedKeys.value.indexOf(key) > -1) {
                    hasCheck === null && (hasCheck = true)
                } else {
                    hasUncheck === null && (hasUncheck = true)
                }
            })

            if (hasCheck && !hasUncheck) {return CheckboxStatus.check}
            if (!hasCheck && hasUncheck) {return CheckboxStatus.uncheck}
            return CheckboxStatus.minus
        })
        /*是否可以选中*/
        const isCheckable = (node: TableNode) => !props.isCheckable || (props.isCheckable(node.data as any) !== false)
        /*判断是否选中*/
        const isCheck = (node: TableNode) => selectedKeys.value.indexOf(getKey(node.data)) > -1
        /*切换选中状态*/
        const toggle = (node: TableNode) => {
            const index = selectedKeys.value.indexOf(getKey(node.data))
            index > -1 ? state.selectedRows.splice(index, 1) : state.selectedRows.push(node.data)
        }
        const handler = {
            /*处理点击复选框按钮动作*/
            onClickCheckbox: (node: TableNode) => isCheckable(node) && toggle(node),
        }
        const methods = {
            /*获取选中行数据*/
            getSelected: () => state.selectedRows,
            /*清空当前也选中行*/
            clearAll: () => {
                const currentPageKeys = table.flatNodes.value.map(node => getKey(node.data))
                state.selectedRows = state.selectedRows.filter(row => currentPageKeys.indexOf(getKey(row) === -1))
            },
            /*选中当前页*/
            checkAll: () => {
                const add = table.flatNodes.value.filter(node => selectedKeys.value.indexOf(getKey(node.data) === -1))
                state.selectedRows.push(...add)
            },
            /*反选当前页*/
            reverse: () => {
                const add: any[] = []

                const flatNodes = [...table.flatNodes.value]
                let flatLen = flatNodes.length
                let index = 0
                let current = flatNodes[index]
                while (index <= flatLen) {
                    if (selectedKeys.value.indexOf(getKey(current.data)) > -1) {
                        flatNodes.splice(index, 1)
                        index--
                        flatLen--
                    } else {
                        add.push(current.data)
                    }
                    index++
                    current = flatNodes[index]
                }
                state.selectedRows.push(...add)
            },
        }
        if (props.toggleOnClickRow) {
            table.event.on.onClickCell(handler.onClickCheckbox)
            onBeforeUnmount(() => table.event.off.onClickRow(handler.onClickCheckbox))
        }

        const {refer, render} = useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                summary: () => null,
                normal: ({node}) => <PlCheckbox
                    customReadonly
                    modelValue={isCheck(node)}
                    onClick={() => handler.onClickCheckbox(node)}
                    disabled={!isCheckable(node)}
                />,
                head: () => (
                    <PlDropdown
                        {...{placement: 'bottom-center'}}
                        default={() => <PlCheckbox checkStatus={status.value}/>}
                        popper={() => <PlDropdownMenu>
                            <PlDropdownOption label="全选当前页" icon="el-icon-check-bold" onClick={methods.checkAll}/>
                            <PlDropdownOption label="取消当前页" icon="el-icon-close-bold" onClick={methods.clearAll}/>
                            <PlDropdownOption label="反选当前页" icon="el-icon-refresh" onClick={methods.reverse}/>
                        </PlDropdownMenu>}
                    />
                )
            }
        })

        return {
            refer: {
                ...refer,
                isCheckable,
                isCheck,
                toggle,
                ...methods,
            },
            render,
        }
    },
})

export function useTableOptionCheck({hooks, config, confirm}: {
    hooks: tTableOptionHooks,
    config: tTableOptionConfig,
    confirm: tTableOptionConfirm,
}) {

    const $message = useMessage()

    const state = reactive({
        showCheck: false,
    })
    const {refs, onRef} = useRefs({check: PlcProCheck})

    hooks.onColumns.use((content) => {
        if (!state.showCheck) {
            return content
        }
        return <>
            <PlcProCheck
                ref={onRef.check}
                key="pro-checkbox"
                toggleOnClickRow
                keyField={config.keyField}/>
            {content}
        </>
    })

    const showCheckbox = () => {state.showCheck = true}
    const hideCheckbox = () => {state.showCheck = false}

    const clear = () => {
        console.log('清空选择')
    }
    const check = () => {console.log('选中某行')}
    const checkAll = () => {console.log('全选当前页')}
    const uncheck = () => {console.log('取消选中某行')}
    const uncheckAll = () => {console.log('取消选中当前页')}
    const reverse = () => {console.log('反选当前页')}
    const toggle = () => {console.log('切换选中状态')}
    const openToCheck = () => {
        const dfd = defer<PlainObject[]>()
        showCheckbox()
        confirm.open(eTableProStatus.select, {
            confirmText: '确定',
            onConfirm: () => {
                const selectedRows = refs.check!.getSelected()
                if (selectedRows.length === 0) {
                    throw $message.warn('请至少选中一行数据！')
                }
                dfd.resolve(selectedRows)
                hideCheckbox()
            },
            onCancel: () => {
                console.log('取消选择')
                hideCheckbox()
            },
        })
        return dfd.promise
    }

    return {
        open,
        close,
        clear,
        check,
        checkAll,
        uncheck,
        uncheckAll,
        reverse,
        toggle,
        openToCheck,
    }
}

export type tTableOptionCheck = ReturnType<typeof useTableOptionCheck>