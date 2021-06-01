import {designPlc} from "../core/designPlc";
import {TableNode} from "../../table/use/useTableNode";
import {SimpleObject} from "../../../../shims";
import {tPlc} from "../utils/plc.type";
import {ComputedRef} from "plain-design-composition";
import React, {ReactNode} from "react";
import {injectPlainTable} from "../../index";
import {computed, onBeforeUnmount, PropType} from "plain-design-composition";
import {reactive} from "plain-design-composition";
import PlDropdown from "../../../PlDropdown";
import PlButton from "../../../PlButton";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {classnames} from "plain-design-composition";

interface ExpandRefer {
    isExpand: (node: TableNode) => boolean,
    totalSpan: ComputedRef<number>,
    state: { expandKeys: Record<string, boolean> },
    toggle: (node: TableNode) => void,
    props: { expand?: (scope: { node: TableNode, plc: tPlc, row: SimpleObject }) => ReactNode },
    width: () => number,
    methods: {
        expandAll: () => void,
        collapseAll: () => void,
    },
}

export default designPlc(
    {
        name: 'plc-expand',
        standardProps: {
            autoFixedLeft: {default: true},
            order: {default: -9997},
            width: {default: 60},
            align: {default: 'center'},
            noPadding: {default: true},
            renderAfterRow: {
                default: ({plc, node, row}: { plc: tPlc & { externalRefer: () => ExpandRefer }, node: TableNode, row: SimpleObject }) => {
                    const refer = plc.externalRefer()
                    if (!refer.isExpand(node)) {return null}
                    return (
                        <tr className="plt-row plt-expand-row" key={`expand_${node.key}`}>
                            <td className="plt-cell" rowSpan={1} colSpan={refer.totalSpan.value}>
                                <div className="plt-expand-body" style={{width: `${refer.width() - 20}px`}}>
                                    {!!refer.props.expand && refer.props.expand({node, plc, row})}
                                </div>
                            </td>
                        </tr>
                    )
                }
            },
        },
        externalProps: {
            expand: {type: Function as PropType<(scope: { node: TableNode, plc: tPlc, row: SimpleObject }) => ReactNode>},             // 列内容默认渲染函数
            toggleOnClickRow: {type: Boolean},                      // 是否在点击行的时候触发点击动作
            summaryExpand: {type: Boolean},                         // 合计行是否可以展开
        },
        setup: (props) => {
            const table = injectPlainTable()
            /*告诉 table，不能启用虚拟滚动*/
            table.hooks.onDisabledVirtual.use(() => true)

            const state = reactive({
                expandKeys: {} as Record<string, boolean>,
            })
            const totalSpan = computed(() => !table.plcData.value ? 1 : table.plcData.value.flatPlcList.length)
            const isExpand = (node: TableNode) => state.expandKeys[node.key]
            const toggle = (node: TableNode) => isExpand(node) ? close(node) : expand(node)
            const expand = (node: TableNode) => state.expandKeys[node.key] = true
            const close = (node: TableNode) => state.expandKeys[node.key] = false
            if (props.toggleOnClickRow) {
                table.event.on.onClickCell(toggle)
                onBeforeUnmount(() => table.event.off.onClickRow(toggle))
            }
            const methods = {
                expandAll: () => {
                    state.expandKeys = {}
                    Object.values(table.state.nodeMap).forEach(node => expand(node))
                },
                collapseAll: () => {
                    state.expandKeys = {}
                },
            }
            const refer: ExpandRefer = {
                state,
                totalSpan,
                isExpand,
                toggle,
                props,
                width: () => table.plcData.value!.tableWidth,
                methods,
            }
            return refer
        }
    },
    {
        head: ({refer}) => (
            <PlDropdown
                {...{placement: "bottom-center"}}
                default={() => <PlButton icon="el-icon-menu" mode="text"/>}
                popper={() => <PlDropdownMenu>
                    <PlDropdownOption label="全部展开" onClick={refer.methods.expandAll} icon="el-icon-zoom-full"/>
                    <PlDropdownOption label="全部收起" onClick={refer.methods.collapseAll} icon="el-icon-zoom-scale"/>
                </PlDropdownMenu>}
            />
        ),
        default: ({refer, node, props}) => {
            return (!node.isSummary || props.summaryExpand) && (<PlButton{...{
                icon: 'el-icon-arrow-down',
                mode: 'text',
                className: classnames([
                    'plc-expand-icon',
                    {'plc-expand-icon-active': refer.isExpand(node)},
                ]),
                onClick: (e: React.MouseEvent) => refer.toggle(node)
            }}/>)
        }
    },
)