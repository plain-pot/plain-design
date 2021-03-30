import React from "react"
import {designPage} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlTable data={data}>

                </PlTable>
            </DemoRow>
        </div>
    )
})