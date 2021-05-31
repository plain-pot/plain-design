import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import {PlcStandardGroupOptions} from "../core/plc.props";
import {usePropsState} from "../../utils/usePropsState";
import {tPlcGroup} from "../core/plc.utils";
import {useCollect} from "../../../../use/useCollect";
import Plc from "./Plc";

const PlcGroup = designComponent({
    name: 'plc-group',
    props: PlcStandardGroupOptions,
    slots: [
        'default'
    ],
    setup({props, slots}) {

        PlcCollector.child({sort: () => refs.el!, injectDefaultValue: null})
        const items = PlcCollector.parent(true)

        const {refs, onRef} = useRefs({el: HTMLSpanElement})
        const propsState = usePropsState(props)
        const refer: tPlcGroup = {
            state: propsState,
            group: true,
            items,
        }

        return {
            refer,
            render: () => (
                <span className="plc-group" ref={onRef.el}>
                    {slots.default()}
                </span>
            )
        }
    },
})

export default PlcGroup

export const PlcCollector = useCollect(() => ({
    parent: PlcGroup,
    child: Plc,
}))