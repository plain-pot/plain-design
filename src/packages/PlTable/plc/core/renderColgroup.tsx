import React from "react";
import {Plc} from "./plc.type";

export function renderColgroup(flatPlcList: Plc[]) {
    return (
        <colgroup>
            {flatPlcList.map((plc, index) => <col key={index} width={plc.props.width || ''}/>)}
        </colgroup>
    )
}