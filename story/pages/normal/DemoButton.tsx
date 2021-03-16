import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton/PlButton";

export default designComponent({
    setup() {
        return {
            render: () => (
                <div>
                    <DemoRow title={"基本用法"}>
                        <PlButton label={"按钮"}/>
                    </DemoRow>
                </div>
            )
        }
    },
})