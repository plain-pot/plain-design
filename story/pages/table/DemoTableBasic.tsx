import React from "react"
import {designPage} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import Plc from "../../../src/packages/PlTable/plc/core/Plc";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlTable data={data}>
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>
        </div>
    )
})