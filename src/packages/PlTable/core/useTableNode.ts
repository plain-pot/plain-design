import {SimpleObject} from "../../../shims";
import {TableProps} from "./table.utils";
import {createKeyHandler} from "../../../utils/createKeyHandler";
import {deepcopy} from "plain-utils/object/deepcopy";
import {computed, ExtractPropTypes} from "plain-design-composition";
import {FormValidate, FormValidateResultMap, FormValidateReturn} from "../../PlForm/form.validate";
import {useTree} from "../../PlTree/core/useTree";
import {TreeNodeCheckStatus} from "../../PlTree/utils/tree-constant";

export function useTableNode(
    {
        props,
        emit,
        getValidate,
    }: {
        props: ExtractPropTypes<typeof TableProps>,
        getValidate: () => FormValidate,
        emit: {
            onExpand: (node: TableNode) => void,
            onExpandChange: (keys: string[]) => void,
            onCollapse: (node: TableNode) => void,
            onCheck: (node: TableNode) => void,
            onUncheck: (node: TableNode) => void,
            onCheckChange: (keys: string[]) => void,
            onClickNode: (node: TableNode) => void,
            onUpdateData: (data?: SimpleObject[]) => void,
            onUpdateCurrentKey: (key?: string) => void,
        },
    }
) {
    const {state, dataModel, utils, methods, current, handler} = useTree<TableNode>({
        props,
        keyManager: createKeyHandler('table'),
        emit,
        getTreeNodeByDataAdjust: node => {
            node.isSummary = false
            node.edit = false
            node.editRow = node.data
            node.validateResultMap = null
            node.openEdit = function () {this.edit = true}
            node.closeEdit = function () {this.edit = false}
            node.enableEdit = function () {
                if (this.edit) return
                this.editRow = deepcopy(this.data)
                this.openEdit()
                this.validate()
            }
            node.cancelEdit = function () {this.edit && this.closeEdit()}
            node.validate = async function () {
                const {methods: {validate}} = getValidate()
                const {validateMessage, validateResult, validateResultMap} = await validate(this.editRow)
                this.validateResultMap = validateResultMap || null
                return !validateMessage ? null : {
                    validateMessage,
                    validateResult,
                    validateResultMap,
                    node: this,
                }
            }
            node.saveEdit = async function (newRow) {
                if (!this.edit) return
                let {data, editRow} = this
                newRow = newRow || this.editRow
                Object.keys({...data, ...editRow, ...newRow}).forEach(k => this.data[k] = newRow[k])
            }
        }
    })
    /*拍平的数组*/
    const flatNodes = computed(() => {
        let list: TableNode[] = []
        if (!state.root) {
            return []
        }
        utils.iterate({
            nodes: state.root.children,
            iterateChildren: (treeNode) => treeNode.expand,
            handler: (treeNode) => list.push(treeNode),
        },)
        list = list.filter((treeNode) => !!treeNode.isVisible)
        list.forEach((node, index) => node.index = index)
        return list
    })
    const summaryNodes = computed(() => !props.summaryData ? null : props.summaryData.map((data) => utils.getTreeNodeByData({data, level: 1, parentRef: null as any, adjust: node => node.isSummary = true})))
    return {state, dataModel, flatNodes, summaryNodes, methods, current, handler, utils}
}

export type TableNode = {

    key: string,                                        // 节点唯一标识
    data: SimpleObject,                                 // 节点数据
    level: number,                                      // 节点层级
    parentRef: () => TableNode | null,                  // 父节点引用
    selfRef: () => TableNode,                           // 自身引用
    index: number,                                      // 节点索引
    children?: TableNode[],                             // 子节点数组

    expand: boolean,                                    // 节点是否已经展开
    check: boolean,                                     // 节点是够已经选中
    loading: boolean,                                   // 节点是否处于加载状态
    loaded: boolean,                                    // 节点是否已经加载完毕

    readonly childrenData?: SimpleObject[]              // 子节点数据数组
    readonly checkStatus: TreeNodeCheckStatus,          // 节点选中状态
    readonly isCheckable: boolean,                      // 节点是否可以选择
    readonly isLeaf: boolean,                           // 节点是否为叶子节点
    readonly isVisible: boolean,                        // 节点是否可见

    /*---------------------------------------edit-------------------------------------------*/

    isSummary: boolean,                                 // 当前是否为合计行数据
    edit: boolean,                                      // 当前是否处于可编辑状态
    editRow: SimpleObject,                              // 编辑行对象
    validateResultMap: FormValidateResultMap | null,    // 当前行的校验结果

    openEdit: () => void,                               // 开启编辑状态（不做任何处理）
    closeEdit: () => void,                              // 关闭编辑状态（不做任何处理）
    enableEdit: () => void,                             // 开启编辑状态（先判断当前是否可编辑，深度赋值一份data赋值给editRow，并且立即执行校验）
    cancelEdit: () => void,                             // 取消编辑状态
    validate: () => Promise<(FormValidateReturn & { node: TableNode }) | null>, // 校验数据
    saveEdit: (newRow: SimpleObject) => Promise<void>,  // 保存编辑，将editRow以及newRow（请求得到的新对象）覆盖data

}