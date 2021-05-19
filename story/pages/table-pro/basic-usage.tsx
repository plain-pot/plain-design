import {designPage} from "plain-design-composition";
import React from "react";
import {useTableOption} from "./useTableOption";
import PlTablePro from "../../../src/packages/PlTablePro";
import {Plc} from "../../../src";

export default designPage(() => {

    const option = useTableOption({
        url: '/demo',
    })

    return () => <>
        <div style={{height: '100%', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <Plc title="id" field="id"/>
                <Plc title="normalText" field="normalText"/>
                <Plc title="numberVal" field="numberVal"/>
            </PlTablePro>
        </div>
    </>
})