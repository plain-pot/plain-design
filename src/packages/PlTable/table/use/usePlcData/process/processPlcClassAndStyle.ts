import {getPlcFixedStyle} from "./processPlcFixed";
import {getPltCellClass} from "./getPltCellClass";
import {tPlcType} from "../../../../plc/core/plc.utils";

export function processPlcClassAndStyle(
    {
        headPlcListArray,
    }: {
        headPlcListArray: tPlcType[][],
    }
) {
    headPlcListArray.forEach((list) => {
        list.forEach((plc) => {
            /*---------------------------------------head-------------------------------------------*/
            plc.styles.head = getPlcFixedStyle(plc)
            plc.classes.head = [
                'plt-cell',
                'plt-head-cell',
                {
                    ...getPltCellClass(plc),
                    'plt-cell-last-fixed-left': plc.isLastFixedLeft,
                    'plt-cell-first-fixed-right': plc.isFirstFixedRight,
                    'plt-cell-no-padding': plc.state.noPadding,
                }
            ]
            /*---------------------------------------body-------------------------------------------*/
            if (!plc.group) {
                plc.styles.body = getPlcFixedStyle(plc)
                plc.classes.body = [
                    'plt-cell',
                    'plt-body-cell',
                    {
                        ...getPltCellClass(plc),
                        'plt-cell-add-edit-padding': plc.state.addEditPadding,
                        'plt-cell-last-fixed-left': plc.isLastFixedLeft,
                        'plt-cell-first-fixed-right': plc.isFirstFixedRight,
                        'plt-cell-no-padding': plc.state.noPadding,
                    },
                ]
            }
        })
    })
}