import {designPage, onMounted} from "plain-design-composition";
import React from "react";
import {env} from "../../env";
import {http} from "../../http/http";

console.log(env)

export default designPage(() => {

    onMounted(async () => {
        const resp = await http.post('/demo/list', {
            page: 0,
            size: 10,
        })
        console.log(resp)
    })

    return () => <>
        hell world
    </>
})