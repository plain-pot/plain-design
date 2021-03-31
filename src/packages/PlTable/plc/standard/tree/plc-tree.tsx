import {designPlc} from "../../core/designPlc";
import {TableNode} from "../../../core/useTableNode";
import {Plc} from "../../core/plc.type";
import {SimpleObject} from "../../../../../shims";
import {unit} from "plain-utils/string/unit";
import {useTableGetScroll} from "../../../core/useTableGetScroll";
import {usePlcTreeDraggier} from "./plc-tree.draggier";
import {delay} from "plain-utils/utils/delay";
import {StyleSize} from "../../../../../use/useStyle";
import {computed, getCurrentDesignInstance, onBeforeUnmount, onMounted, PropType, watch} from "plain-design-composition";
import {TreeDropType} from "../../../../PlTree/utils/tree-constant";
import {injectPlainTable} from "../../../index";
import {PlcPropsDefault} from "../../core/plc.utils";
import {ReactNode} from "react";
import {SimpleFunction} from "plain-design-composition/src/composition/event";
import PlDropdown from "../../../../PlDropdown";
import PlButton from "../../../../PlButton";
import PlDropdownMenu from "../../../../PlDropdownMenu";
import PlDropdownOption from "../../../../PlDropdownOption";
import React from "react";
import {PlCheckbox} from "../../../../PlCheckbox";
import {createEventListener} from "plain-design-composition/src/utils/createEventListener";

/*只显示展开收起按钮的时候的基本宽度，不算content宽度*/
const size = 30

export default designPlc({
    name: 'plc-tree',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9996},
        width: {default: size},
        noPadding: {default: true},
        bodyCls: {default: 'plc-tree-node'},
    },
    externalProps: {
        content: {type: Function as PropType<(scope: { node: TableNode, plc: Plc, row: SimpleObject }) => ReactNode>},             // 列内容默认渲染函数
        contentWidth: {type: Number, default: 100},                         // 显示的内容宽度
        rowDraggable: {type: Boolean},                                      // 行是否可以拖拽排序
        allowRowDraggable: {type: Function as PropType<(node: TableNode) => boolean>},// 行是否可以被拖拽放置到其他位置
        allowRowDroppable: {type: Function as PropType<(startNode: TableNode, moveNode: TableNode, dropType: TreeDropType) => boolean>},// 行是否可以被放置（放到子节点中，放到前面，放到后面）

        folderCollapseIcon: {type: String, default: 'el-icon-folder-s'},
        folderExpandIcon: {type: String, default: 'el-icon-folder-opened'},
        leafIcon: {type: String, default: 'el-icon-document'},
    },
    setup(props) {

        const refer = getCurrentDesignInstance().proxy
        const plc = refer as any as Plc;
        const table = injectPlainTable()
        const {getScroll} = useTableGetScroll(table.event.on.onVirtualMounted)

        const maxShowLevel = computed(() => {
            let ret = 0
            table.flatNodes.value.forEach(node => node.level > ret ? (ret = node.level) : null)
            return ret
        })
        /**
         * 动态列宽，当展开收起的时候，自动更新列宽
         * @author  韦胜健
         * @date    2020/8/24 9:35
         */
        const width = computed(() => {
            // 展开按钮的基本宽度
            let expand = size
            // 内容宽度，如果有content插槽，则加上props.contentWidth
            let content = !!props.content ? props.contentWidth : 0
            // 如果显示复选框，则宽度再加上size
            let check = table.props.showCheckbox ? size : 0
            // 如果显示拖拽排序按钮，则宽度再加上size
            let draggable = props.rowDraggable ? size : 0

            // 每一层都增加一个左边距 (expand + check) * level，所以每一层都加上这个宽度
            const level = maxShowLevel.value
            // 最后最大层的宽度
            return expand * (level - 1) + (content + expand + check + draggable)
        })

        const methods = {
            ...table.expandMethods,
            ...table.checkMethods,
            ...table.treeNodeMethods,
        }

        const handler = {
            ...table.handler,
        }

        const draggier = usePlcTreeDraggier({
            rowClass: 'plt-row',
            dragClass: 'plc-tree-node-drag-btn',
            levelPadding: size,
            flatDataList: table.flatNodes,
            props,
            getScroll,
            getParents: table.utils.getParents,
            methods: {
                ...methods,
                refreshCheckStatus: async () => {
                    await delay(120)
                    table.flatNodes.value.forEach(methods.refreshCheckStatus)
                },
            },
        })

        const utils = {
            getExpanderAttrs: (node: TableNode) => {
                return {
                    style: {marginLeft: unit((node.level - 1) * size)} as any,
                }
            },
        }

        onMounted(() => {
            watch(() => maxShowLevel.value, () => {
                plc.state.width = width.value
            }, {immediate: true})
        })

        Object.assign(refer, methods)

        let unmountListener = [] as SimpleFunction[]
        if (table.props.expandOnClickNode) {
            const listener = (node: TableNode) => methods.toggleExpand(node)
            table.event.on.onClickCell(listener)
            unmountListener.push(listener)
        }
        if (table.props.checkOnClickNode) {
            const listener = (node: TableNode) => methods.toggleCheck(node)
            table.event.on.onClickCell(listener)
            unmountListener.push(listener)
        }
        if (unmountListener.length > 0) {
            onBeforeUnmount(() => unmountListener.forEach(listener => table.event.off.onClickCell(listener)))
        }

        return {
            tableProps: table.props,
            props,
            handler,
            utils,
            draggier,
            methods,
        }
    },
}, {
    summary: () => null,
    head: ({refer, plc}) => (<>
        <PlDropdown
            {...{placement: "bottom"}}
            default={() => <PlButton icon="el-icon-menu" mode="text"/>}
            popper={() => <PlDropdownMenu>
                <PlDropdownOption label="全部展开" icon="el-icon-zoom-full" onClick={refer.methods.expandAll}/>
                <PlDropdownOption label="全部收起" icon="el-icon-zoom-scale" onClick={refer.methods.collapseAll}/>
                {refer.tableProps.showCheckbox && <>
                    <PlDropdownOption label="全部选中" icon="el-icon-check" onClick={refer.methods.checkAll}/>
                    <PlDropdownOption label="取消选中" icon="el-icon-close" onClick={refer.methods.uncheckAll}/>
                </>}
            </PlDropdownMenu>}
        />
        <div className="plc-tree-node-content">{plc.props.title}</div>
    </>),
    default: ({refer, node, plc, row}) => {
        return (
            <>
                <div className="plc-tree-node-expander" {...refer.utils.getExpanderAttrs(node)}>
                    <PlButton
                        loading={node.loading}
                        mode="text"
                        size={StyleSize.normal}
                        icon={node.isLeaf ? refer.props.leafIcon : node.expand ? refer.props.folderExpandIcon : refer.props.folderCollapseIcon}
                        onClick={(e: React.MouseEvent) => !node.isLeaf && refer.handler.onClickExpandIcon(e, node)}/>
                </div>
                {refer.tableProps.showCheckbox && (
                    <div className="plc-tree-node-check">
                        <PlCheckbox
                            key={node.key}
                            size={StyleSize.normal}
                            modelValue={node.check}
                            customReadonly={true}
                            checkStatus={node.checkStatus}
                            disabled={!node.isCheckable}
                            {...{onClick: (e?: React.MouseEvent) => refer.handler.onClickCheckbox(e, node)}}
                        />
                    </div>
                )}
                {refer.props.rowDraggable && (
                    <PlButton mode="text"
                              icon="el-icon-list"
                              className="plc-tree-node-drag-btn"
                              disabled={!refer.draggier.utils.allowDrag(node)}
                              {...createEventListener({onMouseDown: refer.draggier.handler.onMousedown})}/>
                )}
                {!!refer.props.content && (
                    <div className="plc-tree-node-content" style={{width: unit(refer.props.contentWidth)!}}>
                        {refer.props.content({node, row, plc})}
                    </div>
                )}
            </>
        )
    }
})