import {designPlc} from "../core/designPlc";
import {TableNode} from "../../core/useTableNode";
import {CheckboxStatus} from "../../../../utils/constant";
import {toArray} from "../../../../utils/toArray";
import {computed, getCurrentDesignInstance, onBeforeUnmount, PropType, reactive} from "plain-design-composition";
import {injectPlainTable} from "../../index";
import React from "react";
import {PlCheckbox} from "../../../PlCheckbox";
import PlDropdown from "../../../PlDropdown";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";

export default designPlc({
    name: 'plc-check',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9998},
        width: {default: 40},
        align: {default: 'center'},
        noPadding: {default: true},
    },
    externalProps: {
        toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
        isCheckable: Function as PropType<(node: TableNode) => boolean>,// 是否可选
    },
    setup(props) {
        const table = injectPlainTable()
        const proxy = getCurrentDesignInstance().proxy!
        const state = reactive({
            selected: [] as TableNode[],
        })
        const selectedKeys = computed(() => {
            return state.selected.map(item => item.key)
        })
        const status = computed(() => {
            if (state.selected.length === 0) return CheckboxStatus.uncheck
            if (table.flatNodes.value.every((item) => selectedKeys.value.indexOf(item.key) > -1)) {
                return CheckboxStatus.check
            } else {
                return CheckboxStatus.minus
            }
        })
        const isCheckable = (node: TableNode) => !props.isCheckable || (props.isCheckable(node) !== false)
        const isCheck = (node: TableNode) => selectedKeys.value.indexOf(node.key) > -1
        const toggle = (node: TableNode) => {
            const index = selectedKeys.value.indexOf(node.key)
            index > -1 ? state.selected.splice(index, 1) : state.selected.push(node)
        }
        const handler = {
            onClickCheckbox: (node: TableNode) => isCheckable(node) && toggle(node),
        }
        const methods = {
            getSelected: () => state.selected,
            clearAll: () => state.selected = [],
            checkAll: () => {
                const availableSelectItems = table.flatNodes.value
                    .filter(isCheckable)
                    .map((item: TableNode) => item)
                if (state.selected.length === availableSelectItems.length) {
                    state.selected = []
                } else {
                    state.selected = availableSelectItems
                }
            },
            reverse: () => {
                state.selected = table.flatNodes.value
                    .filter(node => isCheckable(node) && selectedKeys.value.indexOf(node.key) === -1)
            },
            addSelected: (key: string | number | (string | number)[]) => {
                const keys = toArray(key)
                const nodes = keys.map(k => table.state.nodeMap[k]).filter(Boolean)
                state.selected = [...state.selected, ...nodes]
            },
            removeSelected: (key: string | number | (string | number)[]) => {
                const keys = toArray(key)
                state.selected = state.selected.filter(node => keys.indexOf(node.key) === -1)
            },
        }
        if (props.toggleOnClickRow) {
            table.event.on.onClickCell(handler.onClickCheckbox)
            onBeforeUnmount(() => table.event.off.onClickRow(handler.onClickCheckbox))
        }
        Object.assign(proxy, methods)
        return {
            state,
            selectedKeys,
            status,
            handler,
            isCheck,
            isCheckable,
            methods,
            ...methods,
        }
    },
}, {
    summary: () => null,
    default: ({refer, node}) => <PlCheckbox
        customReadonly
        modelValue={refer.isCheck(node)}
        onClick={() => refer.handler.onClickCheckbox(node)}
        disabled={!refer.isCheckable(node)}
    />,
    head: ({refer}) => (
        <PlDropdown
            {...{placement: 'bottom-center'}}
            default={() => <PlCheckbox checkStatus={refer.status.value}/>}
            popper={() => <PlDropdownMenu>
                <PlDropdownOption label="全部选中" icon="el-icon-check-bold" onClick={refer.methods.checkAll}/>
                <PlDropdownOption label="全部取消" icon="el-icon-close-bold" onClick={refer.methods.clearAll}/>
                <PlDropdownOption label="全部反选" icon="el-icon-refresh" onClick={refer.methods.reverse}/>
            </PlDropdownMenu>}
        />
    )
})