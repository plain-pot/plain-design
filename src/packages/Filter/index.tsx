import {designComponent} from "plain-design-composition";
import React from "react";

export const PlFilter = designComponent({
    props: {},
    setup: function () {
        return () => (
            <div>
                filter
            </div>
        )
    },
})

export default PlFilter