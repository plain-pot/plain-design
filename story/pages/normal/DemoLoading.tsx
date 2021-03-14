import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlLoading} from "../../../src/packages/PlLoading/PlLoading";

// console.log(delay, PlainLoading)

export default designComponent({
    setup() {
        return () => (
            <div>
                <DemoRow title={"基本用法"}>
                    <PlLoading/>
                </DemoRow>
            </div>
        )
    },
})