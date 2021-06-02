import {PlcGroupPropsOptions, PlcPublicAttrs} from "../utils/plc.utils";
import {tPlcGroup} from "../utils/plc.type";
import {computed, designComponent, reactive, useNumber, useRefs} from "plain-design-composition";
import React from "react";
import {useCollect} from "../../../../use/useCollect";
import Plc from "./Plc";
import {usePropsState} from "../utils/usePropsState";

const PlcGroup = designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupPropsOptions,
    },
    slots: ['default', 'head'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        /*collector收集列信息*/
        PlcCollector.child({sort: () => refs.el!, injectDefaultValue: null})
        const items = PlcCollector.parent(true)
        /*格式化props*/
        const {numberState} = useNumber(props, ['order'])
        const propsState = usePropsState(computed(() => ({
            ...props,
            ...numberState,
        }) as Omit<typeof props, 'order'> & typeof numberState))

        /*核心暴露对象*/
        const group: tPlcGroup = reactive({
            refs,
            /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
            ...PlcPublicAttrs,
            group: true,
            children: items,
            props: propsState,
            slots,
            refer: () => group,
            setDurWidth: (durWidth: number) => {
                const itemDurWidth = Math.floor(durWidth / (items.value.length))
                items.value.forEach(item => item.setDurWidth(itemDurWidth))
            },
        })

        return {
            refer: group,
            render: () => (
                <div ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlcGroup

export const PlcCollector = useCollect(() => ({
    parent: PlcGroup,
    child: Plc,
}))