import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import useObject from "../../../src/packages/useObject";
import {useObjectOption} from "./useObjectOption";
import {$$notice, PlButton} from "../../../src";

export default designPage(() => {

    const {$object} = useObject()

    const option = useObjectOption({
        title: '示例列表',
        url: '/demo',
    })

    const selectRow = async () => {
        const checked = await $object({option})
        $$notice({message: checked.normalText})
    }

    return () => <>
        <DemoRow title="基本用法">
            <PlButton onClick={selectRow} label="选择对象"/>
        </DemoRow>
    </>
})
