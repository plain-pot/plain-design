import {designComponent} from "plain-design-composition";
import React from "react";

export const PlTable = designComponent({
    name: 'pl-table',
    provideRefer: true,
    setup({props}) {
        return {
            refer: {},
            render: () => (
                <div>

                </div>
            )
        }
    },
})

export default PlTable