import {designPage, onMounted} from "plain-design-composition";
import React from "react";
import {env} from "../../env";
import {useTableOption} from "./useTableOption";
import {$http} from "../../http/http";

export default designPage(() => {

    const option = useTableOption({
        url: '/demo',
    })

    onMounted(async () => {
        const data = await $http.post('demo/list', {page: 1, size: 5})
        console.log(data)
    })

    return () => <>
        hell world
    </>
})