import React from "react"
import {designPage, useRefs} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import {reactive} from "plain-design-composition";
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
        check: Plc.PlcCheck,
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
                const {errors, node: {index}} = validates[0]!
                $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
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
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlForm column={1}>
                    <PlFormItem label={'是否开启虚拟滚动'}>
                        <PlToggle v-model={state.virtualFlag}/>
                    </PlFormItem>
                    <PlFormItem label={'编辑'}>
                        <PlButtonGroup disabled={state.editNodes.length === 0}>
                            <PlButton label={'打印数据'} disabled={false} onClick={() => console.log(data.map((item: any) => item.name).join(','))}/>
                            <PlButton label={'获取选中行'} disabled={false} onClick={() => {
                                $$message(refs.check!.getSelected().map((item: any) => item.data.name).join(','))
                            }}/>
                            <PlButton onClick={state.saveEdit} label={'保存编辑'}/>
                            <PlButton onClick={state.cancelEdit} label={'取消编辑'}/>
                        </PlButtonGroup>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <PlTable
                virtual={state.virtualFlag}
                data={data}
                onDblclickCell={state.onDblClickRow}>
                <Plc.PlcIndex/>
                <Plc.PlcCheck ref={onRef.check} toggleOnClickRow/>
                <Plc.PlcDraggier key={state.virtualFlag ? 1 : 2}/>
                <Plc field="id" title="编号"/>
                <Plc field="name" title="普通文本列"/>
                <Plc.PlcInput field="name" title="文本框" required/>
                <Plc.PlcNumber field={'size'} title={'数字框'}/>
                <Plc.PlcDate field={'date'} title={'日期'}/>
                <Plc.PlcColorPicker field={'color'} title={'颜色'}/>
                <Plc.PlcRate field={'star'} title={'评分'}/>
                <Plc.PlcToggle field={'flag'} title={'开关'}/>
            </PlTable>
        </div>
    )
})