import {designComponent, useNumber, useRefs, computed, reactive} from "plain-design-composition";
import React from "react";
import {PlcStandardGroupOptions} from "../core/plc.props";
import {usePropsState} from "../../utils/usePropsState";
import {PlcPublicAttrs, tPlcGroup} from "../core/plc.utils";
import {useCollect} from "../../../../use/useCollect";
import Plc from "./Plc";

const PlcGroup = designComponent({
    name: 'plc-group',
    props: PlcStandardGroupOptions,
    slots: [
        'default'
    ],
    setup({props, slots}) {
        const {refs, onRef} = useRefs({el: HTMLSpanElement})
        PlcCollector.child({sort: () => refs.el!, injectDefaultValue: null})
        const items = PlcCollector.parent(true)

        /*格式化props*/
        const {numberState} = useNumber(props, ['order'])
        /*目标props*/
        const formatProps = computed(() => ({
            ...props,
            ...numberState,
        }) as Omit<typeof props, 'order'> & typeof numberState)

        const propsState = usePropsState(() => formatProps.value)
        const refer: tPlcGroup = reactive({
            ...PlcPublicAttrs,
            props: propsState,
            group: true,
            children: items,
            refer: () => refer,
        })

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