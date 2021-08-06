import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import PlDropdown from "../../../src/packages/PlDropdown";
import PlButton from "../../../src/packages/PlButton";
import PlDropdownMenu from "../../../src/packages/PlDropdownMenu";
import PlDropdownOption from "../../../src/packages/PlDropdownOption";
import $$message from "../../../src/packages/$$message";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import {reactive} from "plain-design-composition";
import PlDropdownGroup from "../../../src/packages/PlDropdownGroup";
import PlIcon from "../../../src/packages/PlIcon";
import {PlCheckbox} from "../../../src";

export default designPage(() => {

    const state = reactive({
        val: {} as any,
        flag: true,
        size: 100,
    })

    setInterval(() => {
        state.size += 5
    }, 1000)

    return () => (
        <div>
            <DemoRow>
                <PlDropdown trigger={'manual'} v-model={state.val[0]} placement="top-end">
                    {{
                        default: <PlButton label={'manual'}/>,
                        popper: (
                            <PlDropdownMenu>
                                <div style={{height: state.size + 'px', width: state.size + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    THIS IS CONTENT
                                </div>
                            </PlDropdownMenu>
                        )
                    }}
                </PlDropdown>
                <PlButton label={`点击：${state.val[0] ? '展开' : '关闭'}`} onClick={() => state.val[0] = !state.val[0]}/>
            </DemoRow>
        </div>
    )
})
