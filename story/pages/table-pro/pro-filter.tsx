import {designPage, reactive} from "plain-design-composition";
import React from "react";
import PlFilter from "../../../src/packages/Filter";

export default designPage(() => {
    const state = reactive({})

    return () => <>
        <PlFilter/>
    </>
})