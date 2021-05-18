import {designPage, onMounted} from "plain-design-composition";
import React from "react";
import {env} from "../../env";
import {http} from "../../http/http";
import {useTableOption} from "./useTableOption";

console.log(env)

export default designPage(() => {

    const option = useTableOption({
        url: '',
    })

    return () => <>
        hell world
    </>
})