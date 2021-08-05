import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import useOv from "../../../src/packages/useOv";

export const demo1 = designPage(() => {

    const {$ov} = useOv()

    return () => (
        <DemoRow title="格式化">
            <ul>
                <li>{$ov.getNameByTypeAndCodeComputed('promotion', 'limit_time_discount')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('promotion', 'luck_draw')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('promotion', 'full_discount')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('acct_type', 'ov_supplier')}</li>
                <li>{$ov.getNameByTypeAndCodeComputed('acct_type', 'ov_trade')}</li>
            </ul>
        </DemoRow>
    )
})
