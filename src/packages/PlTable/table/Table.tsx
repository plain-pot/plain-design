import {designComponent, onMounted, useRefs} from "plain-design-composition";
import React from "react";
import {PlcGroup} from "../../PlcGroup";
import {StyleProps, StyleShape, StyleSize, useStyle} from "../../../use/useStyle";
import {EditProps} from "../../../use/useEdit";
import {useTableHooks} from "./use/useTableHooks";
import {usePlcData} from "./use/usePlcData";

export default designComponent({
    name: 'pl-table',
    props: {
        ...EditProps,
        ...StyleProps,
    },
    provideRefer: true,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({
            group: PlcGroup,
            el: HTMLDivElement,
        })

        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape as any || StyleShape.square
                config.size = props.size as any || StyleSize.normal
                config.status = props.status as any
            }
        })

        const hooks = useTableHooks()
        const {} = usePlcData({hooks})

        onMounted(() => {
            hooks.onTableMounted.exec(refs.el!)
        })

        return {
            refer: {},
            render: () => (
                <div className="pl-table" ref={onRef.el}>
                    <PlcGroup ref={onRef.group}>{slots.default()}</PlcGroup>
                </div>
            )
        }
    },
})