import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import {PlcStandardGroupOptions} from "../core/plc.props";
import {usePropsState} from "../../utils/usePropsState";
import {iPlcGroup} from "../core/plc.utils";

export const PlcGroup = designComponent({
    name: 'plc-group',
    props: PlcStandardGroupOptions,
    slots: [
        'default'
    ],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLSpanElement})
        const propsState = usePropsState(props)
        const refer: iPlcGroup = {
            state: propsState,
            group: true,
            items: {value: []}
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