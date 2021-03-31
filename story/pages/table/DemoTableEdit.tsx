import React from "react"
import {designPage} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import {reactive} from "@vue/reactivity";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import PlToggle from "../../../src/packages/PlToggle";
import Plc from "../../../src/packages/Plc";
import {TableNode} from "../../../src/packages/PlTable/core/useTableNode";
import {FormRule} from "../../../src/packages/PlForm/form.validate";
import $$message from "../../../src/packages/$$message";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const state = reactive({
        data,
        editNodes: [] as TableNode[],
        virtualFlag: false,
        associateFields: {
            name: 'size',
        },
        isEditable: ({editRow}: TableNode) => !!editRow.name && editRow.name.length > 5,
        customRule: {
            validator: (rule: FormRule, value: any, row: any) => !!row.name && row.name.length > 5 ?
                (!row.size && row.size !== 0) ? 'name 长度大于5情况下必填' : undefined
                : undefined
        },
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
                    associateFields={state.associateFields}
                    onDblclickCell={state.onDblClickRow}>
                    <Plc.PlcIndex/>
                    <Plc field="id" title="编号" width={'50'}/>
                    <Plc field="name" title="普通文本列"/>
                    <Plc field="name" title="普通文本列，编辑作用域插槽" width={200} editable={state.isEditable}
                         edit={({row}) => (
                             <input type="text" v-model={row.name} style={{paddingLeft: '8px'}}/>
                         )}
                    />
                    <Plc.PlcInput field="name" title="禁用编辑" editable={false}/>
                    <Plc.PlcInput field="name" title="文本框" required/>
                    <Plc.PlcInput field="size" title="文本框值大于6可以编辑" width={200} editable={state.isEditable} rules={state.customRule}/>
                    <Plc.PlcNumber field={'size'} title={'数字框'}/>
                    <Plc.PlcDate field={'date'} title={'日期'}/>
                    <Plc.PlcColorPicker field={'color'} title={'颜色'}/>
                    <Plc.PlcRate field={'star'} title={'评分'}/>
                </PlTable>
            </DemoRow>
        </div>
    )
})