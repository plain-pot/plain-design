import {tPlcType} from "../../plc/utils/plc.type";
import {useHeadCellResize} from "./useHeadCellResize";
import {renderHeadCell} from "../../plc/utils/render";
import {useColDraggier} from "./useColDraggier";
import {computed, designComponent, PropType} from "plain-design-composition";
import {PlainTable} from "../../index";
import {PlainScroll} from "../../../PlScroll";
import {classnames} from "plain-design-composition";
import React from "react";

export const PltHeadCell = designComponent({
    name: 'plt-head-cell',
    props: {
        table: {type: PlainTable, required: true},
        tablePlc: {type: Object as PropType<tPlcType>, required: true},
        scroll: {type: Function as PropType<() => PlainScroll>, required: true},
    },
    setup({props}) {

        const {resizeHandler} = useHeadCellResize(props.table, props.tablePlc)
        const {tdAttrs} = useColDraggier(computed(() => ({
            table: props.table,
            plc: props.tablePlc,
            scrollRefer: props.scroll,
        })))

        return {
            render: () => {
                const content = renderHeadCell(props.tablePlc)
                return (
                    <td
                        className={classnames([
                            props.tablePlc.classes.head,
                            props.tablePlc.props.headCls,
                            !!props.table.props.headCellClassFunc ? props.table.props.headCellClassFunc(props.tablePlc) : null
                        ] as any)}
                        style={{
                            ...props.tablePlc.styles.head as any,
                            ...(!!props.table.props.headCellStyleFunc ? props.table.props.headCellStyleFunc(props.tablePlc) : {})
                        }}
                        rowSpan={props.tablePlc.rowspan}
                        colSpan={props.tablePlc.colspan}
                        {...tdAttrs}
                    >
                        {content}
                        <span className="plt-head-cell-indicator" onMouseDown={resizeHandler.mousedown}/>
                    </td>
                )
            }
        }
    },
})