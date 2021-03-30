import {PltCell} from "./cell";
import {TableNode} from "../useTableNode";
import {designComponent, PropType} from "plain-design-composition";
import {PlainTable} from "../../index";
import useClass from "plain-design-composition/src/use/useClasses";
import React from "react";

export const PltRow = designComponent({
    name: 'plt-row',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        vid: {type: [String, Number]},
    },
    setup({props}) {

        const handler = {
            onClick: (e: React.MouseEvent) => props.table.handler.onClickRow(e, props.node),
            onDoubleClick: (e: React.MouseEvent) => props.table.handler.onDblclickRow(e, props.node),
            vid: props.vid,
        }

        const classes = useClass(() => {
            const ret = [
                'plt-row',
                {
                    'plt-row-current': props.table.current.value == props.node.key
                }
            ] as any[]
            if (!!props.table.props.rowClassFunc) {
                ret.push(props.table.props.rowClassFunc(props.node))
            }
            return ret
        })

        return {
            render: () => {
                const content = [
                    (<tr className={classes.value} style={{height: `${props.table.numberState.bodyRowHeight}px`}} {...handler}>
                        {props.table.plcData.value!.flatPlcList.map((plc, index) => <PltCell key={index} table={props.table} node={props.node} plc={plc}/>)}
                    </tr>),
                ]
                if (props.table.plcData.value!.plcListHasRenderAfterRow) {
                    content.push(...props.table.plcData.value!.plcListHasRenderAfterRow.map(plc => plc.props.renderAfterRow!({node: props.node, plc, row: props.node.data,}) as JSX.Element))
                }
                return content.filter(Boolean)
            }
        }
    },
})