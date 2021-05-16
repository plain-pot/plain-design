import {designPage, onMounted} from "plain-design-composition";
import React from "react";
import {env} from "../../env";
import {http} from "../../http/http";

console.log(env)

export default designPage(() => {

    onMounted(async () => {

    })

    return () => <>
        hell world
    </>
})