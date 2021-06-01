import {designComponent, useNumber, useRefs, computed} from "plain-design-composition";
import React from "react";
import {PlcStandardPropOptions} from "../core/plc.props";
import {usePropsState} from "../../utils/usePropsState";
import {PlcPublicAttrs, tPlc} from "../core/plc.utils";
import {PlcCollector} from "./PlcGroup";

export default designComponent({
    name: 'plc',
    props: PlcStandardPropOptions,
    setup({props}) {

        PlcCollector.child({sort: () => refs.el!})
        const {refs, onRef} = useRefs({el: HTMLSpanElement})

        /*格式化props*/
        const {numberState} = useNumber(props, ['order', 'width'])
        /*目标props*/
        const formatProps = computed(() => ({
            ...props,
            ...numberState,
        }) as Omit<typeof props, 'order' | 'width'> & typeof numberState)

        const propsState = usePropsState(() => formatProps.value)

        const refer: tPlc = {
            ...PlcPublicAttrs,
            props: propsState,
            group: false,
            refer: () => refer,
        }

        return {
            refer,
            render: () => (
                <span ref={onRef.el} className="plc"/>
            )
        }
    },
})