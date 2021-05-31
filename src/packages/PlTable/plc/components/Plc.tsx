import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import {PlcStandardPropOptions} from "../core/plc.props";
import {usePropsState} from "../../utils/usePropsState";
import {iPlc} from "../core/plc.utils";

export const Plc = designComponent({
    name: 'plc',
    props: PlcStandardPropOptions,
    setup({props}) {

        const {refs, onRef} = useRefs({el: HTMLSpanElement})
        const propsState = usePropsState(props)

        const refer: iPlc = {
            state: propsState,
        }

        return {
            refer,
            render: () => (
                <span ref={onRef.el} className="plc"/>
            )
        }
    },
})