import {computed, designComponent, getCurrentDesignInstance, onBeforeUnmount, PropType, reactive} from "plain-design-composition";
import {PlainObject, tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {PlcCheck} from "../../PlcCheck";
import React from "react";
import {eTableProStatus, tTableOptionConfirm} from "./use.confirm";
import {createPlcPropOptions, PlcEmitsOptions} from "../../PlTable/plc/utils/plc.utils";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {PlcScopeSlotsOptions} from "../../PlTable/plc/utils/plc.scope-slots";
import {injectPlainTable} from "../../PlTable";
import {CheckboxStatus} from "../../../utils/constant";
import {toArray} from "../../../utils/toArray";
import {useExternalPlc} from "../../PlTable/plc/core/useExternalPlc";
import {PlCheckbox} from "../../PlCheckbox";
import PlDropdown from "../../PlDropdown";
import PlDropdownMenu from "../../PlDropdownMenu";
import PlDropdownOption from "../../PlDropdownOption";

const PlcProChecj = designComponent({
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
            selected: [] as PlainObject[],
        })
        /*获取对象的key*/
        const getKey = (row: any) => row[props.keyField]
        /*选中行数组的key数组*/
        const selectedKeys = computed(() => state.selected.map(item => getKey(item)))
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
            index > -1 ? state.selected.splice(index, 1) : state.selected.push(node.data)
        }
        const handler = {
            /*处理点击复选框按钮动作*/
            onClickCheckbox: (node: TableNode) => isCheckable(node) && toggle(node),
        }
        const methods = {
            /*获取选中行数据*/
            getSelected: () => state.selected,
            /*清空当前也选中行*/
            clearAll: () => {
                const currentPageKeys = table.flatNodes.value.map(node => getKey(node.data))
                state.selected = state.selected.filter(i => currentPageKeys.indexOf(getKey(i) === -1))
            },
            /*选中当前页*/
            checkAll: () => {
                const add = table.flatNodes.value.filter(node => selectedKeys.value.indexOf(getKey(node.data) === -1))
                state.selected.push(...add)
            },
            /*反选当前页*/
            reverse: () => {
                state.selected = table.flatNodes.value
                    .filter(node => isCheckable(node) && selectedKeys.value.indexOf(node.key) === -1)
            },
            /*添加选中行*/
            addSelected: (key: string | number | (string | number)[]) => {
                const keys = toArray(key)
                const nodes = keys.map(k => table.state.nodeMap[k]).filter(Boolean)
                state.selected = [...state.selected, ...nodes]
            },
            /*移除选中行*/
            removeSelected: (key: string | number | (string | number)[]) => {
                const keys = toArray(key)
                state.selected = state.selected.filter(node => keys.indexOf(node.key) === -1)
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
                            <PlDropdownOption label="全部选中" icon="el-icon-check-bold" onClick={methods.checkAll}/>
                            <PlDropdownOption label="全部取消" icon="el-icon-close-bold" onClick={methods.clearAll}/>
                            <PlDropdownOption label="全部反选" icon="el-icon-refresh" onClick={methods.reverse}/>
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

    const state = reactive({
        showCheck: false,
    })

    hooks.onColumns.use((content) => {
        if (!state.showCheck) {
            return content
        }
        return <>
            <PlcCheck key="pro-checkbox"/>
            {content}
        </>
    })

    const open = () => {
        state.showCheck = true
    }
    const close = () => {
        state.showCheck = false
    }
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
        open()
        confirm.open(eTableProStatus.select, {
            onConfirm: () => {
                console.log('选择完毕')
                close()
            },
            onCancel: () => {
                console.log('取消选择')
                close()
            },
        })
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