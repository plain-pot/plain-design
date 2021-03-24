import {designComponent} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import {DemoRow} from "../../components/DemoRow";

export default designComponent({
    setup() {
        return () => (
            <div className={'test-page'}>
                <DemoRow>
                    demo
                </DemoRow>
            </div>
        )
    },
})