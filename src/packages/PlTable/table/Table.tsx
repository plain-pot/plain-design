import {designComponent, onMounted, useRefs} from "plain-design-composition";
import React from "react";
import {PlcGroup} from "../../PlcGroup";

export default designComponent({
    name: 'pl-table',
    provideRefer: true,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({group: PlcGroup})

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