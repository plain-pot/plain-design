import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import useAddress from "../../../src/packages/useAddress";

export const demo1 = designPage(() => {

    const {$address} = useAddress()


    return () => <>
        <DemoRow title="格式化地址code">
            <ul>
                <li>{$address.getNameByCodeComputed('652800')}</li>
                <li>{$address.getNameByCodeComputed('430000')}</li>
                <li>{$address.getNameByCodeComputed('230000')}</li>
            </ul>
        </DemoRow>
    </>

})
