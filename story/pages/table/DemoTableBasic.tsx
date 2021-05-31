import React from "react"
import {designPage, reactive} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import {PlTable} from "../../../src/packages/PlTable";
import {Plc} from "../../../src/packages/Plc";
import {PlcGroup} from "../../../src/packages/PlcGroup";

export default designPage(() => {

    const state = reactive({
        data,
        stripe: false,
        size: undefined as any,
        summaryData: [
            {
                "id": 0,
                "color": "#79f285",
                "name": "Lisa",
                "date": "2002-04-28",
                "star": "★★★★★★★",
                "size": 49
            },
            {
                "id": 1,
                "color": "#f27990",
                "name": "George",
                "date": "2019-01-06",
                "star": "★★★★★★★★",
                "size": 74
            },
        ],
        other: {
            hasSummaryData: true,
            groupHead: false,
        },
        props: {
            headRowHeight: undefined,
            bodyRowHeight: undefined,
            border: false,
            virtual: false,
        },
        plc: {
            width: 200,
            align: 'left',
            init: true,
            order: 5,
            hide: undefined,
        },
        /*editNode: null as null | TableNode,
        onDblclickCell: (node: TableNode) => {
            console.log('node', node)
            if (!!state.editNode) {
                if (node === state.editNode) {
                    node.saveEdit()
                    node.closeEdit()
                    state.editNode = null
                    return
                } else {
                    state.editNode.cancelEdit()
                }
            }

            node.enableEdit()
            state.editNode = node
        },*/
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlTable
                >

                    {!!state.other.groupHead && <>
                        <Plc title={'普通文本列'} field={'id'}/>
                        <Plc title={'设置宽度'} field={'id'} width={state.plc.width} align={state.plc.align}/>
                        <Plc title={'大小'} field={'size'} align={state.plc.align}/>
                        <PlcGroup title={'地址'} align={state.plc.align}>
                            <Plc field="date" title="日期" align={state.plc.align}/>
                            {!!state.plc.init && <Plc field="name" title="名称" align={state.plc.align}/>}
                            <Plc field="color" title="颜色" align={state.plc.align}/>
                        </PlcGroup>
                    </>}
                    {!state.other.groupHead && <>
                        <Plc field="id" title="编号(order=4)" order="4" align={state.plc.align}/>
                        <Plc field="size" title="大小" align={state.plc.align}/>
                        {!!state.plc.init && <Plc field="name" title="名称" order={state.plc.order} align={state.plc.align}/>}
                        <Plc field="date" title="日期(order=6)" order="6" align={state.plc.align}/>
                        <Plc field="color" title="颜色" align={state.plc.align}/>
                        <Plc field="star" title="评分" hide={state.plc.hide} align={state.plc.align}/>
                    </>}
                </PlTable>
            </DemoRow>
        </div>
    )
})
