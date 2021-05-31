import {designComponent, onMounted, useRefs} from "plain-design-composition";
import React from "react";
import {PlcGroup} from "../../PlcGroup";
import {StyleProps, StyleShape, StyleSize, useStyle} from "../../../use/useStyle";
import {EditProps} from "../../../use/useEdit";

export default designComponent({
    name: 'pl-table',
    props: {
        ...EditProps,
        ...StyleProps,
    },
    provideRefer: true,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({group: PlcGroup})

        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape as any || StyleShape.square
                config.size = props.size as any || StyleSize.normal
                config.status = props.status as any
            }
        })

        onMounted(() => {
            // console.log(refs.group!.items.value)
        })

        return {
            refer: {},
            render: () => (
                <div className="pl-table">
                    <PlcGroup ref={onRef.group}>{slots.default()}</PlcGroup>
                </div>
            )
        }
    },
})