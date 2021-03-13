import {designComponent} from "plain-design-composition";
import React from "react";

export const DemoButton = designComponent({
    setup() {
        return {
            render: () => (
                <div>
                    this is demo button
                </div>
            )
        }
    },
})