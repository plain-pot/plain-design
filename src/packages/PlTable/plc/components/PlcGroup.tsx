import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import {PlcStandardGroupOptions} from "../core/plc.props";

export const PlcGroup = designComponent({
    name: 'plc-group',
    props: PlcStandardGroupOptions,
    slots: [
        'default'
    ],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLSpanElement})

        return {
            refer: {
                props,
            },
            render: () => (
                <span className="plc-group" ref={onRef.el}>
                    {slots.default()}
                </span>
            )
        }
    },
})