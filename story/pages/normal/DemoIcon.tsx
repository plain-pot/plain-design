import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";

export default designComponent({
    setup() {
        return () => (
            <div>
                <DemoRow title={'基本用法'}>
                    demo-icon
                </DemoRow>
            </div>
        )
    },
})