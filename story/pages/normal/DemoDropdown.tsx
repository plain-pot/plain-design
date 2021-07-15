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
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlCheckbox v-model={state.flag} label="响应式内容设计"/>
                <PlButtonGroup>
                    <PlDropdown>
                        {{
                            default: <PlButton label={'Dropdown'}/>,
                            popper: () => (
                                <PlDropdownMenu>
                                    {state.flag && <>
                                        <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                                        <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                                        <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                                        <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                                    </>}
                                    <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                                    <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                                    <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                                    <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                                </PlDropdownMenu>
                            )
                        }}
                    </PlDropdown>
                </PlButtonGroup>
            </DemoRow>

        </div>
    )
})