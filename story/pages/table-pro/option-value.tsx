import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import useOv from "../../../src/packages/useOv";
import {PlOv} from "../../../src";

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

export const demo2 = designPage(() => {

    const state = reactive({
        val: undefined,
    })

    return () => <>
        <DemoRow title="数据绑定">
            <PlOv v-model={state.val} ov="promotion"/>
            <PlOv v-model={state.val} ov="promotion"/>
        </DemoRow>
    </>
})

export const demo3 = designPage(() => {

    const state = reactive({
        val: 'full_discount',
    })

    return () => <>
        <DemoRow title="有初始值">
            <PlOv v-model={state.val} ov="promotion"/>
        </DemoRow>
    </>
})
