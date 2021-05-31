import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import {PlcStandardPropOptions} from "../core/plc.props";

export const Plc = designComponent({
    name: 'plc',
    props: PlcStandardPropOptions,
    setup({props}) {

        const {refs, onRef} = useRefs({el: HTMLSpanElement})

        return {
            refer: {
                props,
            },
            render: () => (
                <span ref={onRef.el} className="plc"/>
            )
        }
    },
})