import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import PlPagination from "../../../src/packages/PlPagination";

export default designPage(() => {

    const val = reactive({
        val: (() => {
            let val = []
            for (let i = 0; i < 20; i++) {
                val.push({
                    current: 1,
                    size: 20,
                })
            }
            val[5].current = 7
            val[6].current = 3
            val[7].current = 10
            return val
        })() as any
    }).val

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlPagination
                    total={20000}
                    pageSize={val[0].size}
                    currentPage={val[0].current}
                    onCurrentChange={page => val[0].current = page}
                    onJump={page => val[0].current = page}
                    onSizeChange={size => val[0].size = size}
                />
                <div>{JSON.stringify(val[0])}</div>
            </DemoRow>
        </div>
    )
})