import {designComponent} from "plain-design-composition";
import React from "react";
import {PlcGroup} from "../../PlcGroup";

export default designComponent({
    name: 'pl-table',
    provideRefer: true,
    slots: ['default'],
    setup({props, slots}) {
        return {
            refer: {},
            render: () => (
                <div>
                    <PlcGroup>{slots.default()}</PlcGroup>
                </div>
            )
        }
    },
})