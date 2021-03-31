import React from "react"
import {designPage, useRefs} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import {reactive} from "@vue/reactivity";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import PlToggle from "../../../src/packages/PlToggle";
import Plc from "../../../src/packages/Plc";
import {TableNode} from "../../../src/packages/PlTable/core/useTableNode";
import $$message from "../../../src/packages/$$message";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        check: Object as any,
    })

    const state = reactive({
        data,
        editNodes: [] as TableNode[],
        virtualFlag: false,

        onDblClickRow(tableNode: TableNode) {
            if (!tableNode.edit) {
                tableNode.enableEdit()
                state.editNodes.push(tableNode)
            }
        },
        saveEdit: async () => {
            const validates = (await Promise.all(state.editNodes.map(node => node.validate()))).filter(Boolean)
            if (validates.length > 0) {
                console.log(validates)
                const {validateMessage, node: {index}} = validates[0]!
                $$message.error(`第${index + 1}条记录校验不通过，${validateMessage}`)
                return
            }
            // todo 网络保存逻辑
            state.editNodes.forEach(tableNode => tableNode.saveEdit(tableNode.editRow))
            state.editNodes.forEach(tableNode => tableNode.closeEdit())
            state.editNodes = []
        },
        cancelEdit: () => {
            state.editNodes.forEach(tableNode => {
                tableNode.cancelEdit()
            })
            state.editNodes = []
        },
        logSelected: async () => {
            const selected = refs.check!.getSelected()
            console.log(selected)
            $$message(selected.map((item: TableNode) => item.data.name).join(','))
        },
        clearSelected: async () => {
            refs.check!.clearAll()
        },
        addSelected: async () => {
            refs.check!.addSelected([1, 2])
        },
        removeSelected: async () => {
            refs.check!.removeSelected([1, 2])
        }
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlForm column={1}>
                    <PlButtonGroup>
                        <PlButton label={'获取选中行'} onClick={() => state.logSelected()}/>
                        <PlButton label={'清除选中行'} onClick={() => state.clearSelected()}/>
                        <PlButton label={'设置选中第二第三行'} onClick={() => state.addSelected()}/>
                        <PlButton label={'取消选中第二第三行'} onClick={() => state.removeSelected()}/>
                    </PlButtonGroup>
                    <PlFormItem label={'是否开启虚拟滚动'}>
                        <PlToggle v-model={state.virtualFlag}/>
                    </PlFormItem>
                    <PlFormItem label={'编辑'}>
                        <PlButtonGroup disabled={state.editNodes.length === 0}>
                            <PlButton onClick={state.saveEdit} label={'保存编辑'}/>
                            <PlButton onClick={state.cancelEdit} label={'取消编辑'}/>
                        </PlButtonGroup>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <DemoRow title={'行内编辑'}>
                <PlTable
                    virtual={state.virtualFlag}
                    data={data}
                    onDblclickCell={state.onDblClickRow}
                    keyField={'id'}
                >
                    <Plc.PlcIndex/>
                    <Plc.PlcCheck ref={onRef.check}/>
                    <Plc field="id" title="编号"/>
                    <Plc field="name" title="普通文本列"/>
                    <Plc.PlcInput field="name" title="文本框" required/>
                    <Plc.PlcNumber field={'size'} title={'数字框'}/>
                    <Plc.PlcDate field={'date'} title={'日期'}/>
                    <Plc.PlcColorPicker field={'color'} title={'颜色'}/>
                    <Plc.PlcRate field={'star'} title={'评分'}/>
                    <Plc.PlcToggle field={'flag'} title={'开关'}/>
                </PlTable>
            </DemoRow>
        </div>
    )
})