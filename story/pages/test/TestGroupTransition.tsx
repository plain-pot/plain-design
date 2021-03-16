import {designComponent} from "plain-design-composition";
import React from "react";

export default designComponent({
    setup() {
        return () => (
            <div>
                <h1>测试队列动画</h1>
            </div>
        )
    },
})