import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import {PlcStandardPropOptions} from "../core/plc.props";
import {usePropsState} from "../../utils/usePropsState";
import {tPlc} from "../core/plc.utils";
import {PlcCollector} from "./PlcGroup";

export default designComponent({
    name: 'plc',
    props: PlcStandardPropOptions,
    setup({props}) {

        PlcCollector.child({sort: () => refs.el!})

        const {refs, onRef} = useRefs({el: HTMLSpanElement})
        const propsState = usePropsState(props)

        const refer: tPlc = {
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