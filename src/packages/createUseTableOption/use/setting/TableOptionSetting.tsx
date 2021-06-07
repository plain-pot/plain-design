import {designComponent} from "plain-design-composition";
import React from "react";

export default designComponent({
    props: {},
    setup({props}) {
        return () => (
            <div className="pl-table-pro-setting">
                设置内容
            </div>
        )
    },
})