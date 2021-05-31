import {designComponent} from "plain-design-composition";
import React from "react";

export const Plc = designComponent({
    name: 'plc',
    props: {},
    setup({props}) {
        return {
            render: () => (
                <span/>
            )
        }
    },
})