import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import PlColorAlphaSlider from "../../../src/packages/PlColorPicker/sub/PlColorAlphaSlider";
import PlColorHueSlider from "../../../src/packages/PlColorPicker/sub/PlColorHueSlider";
import PlColorPanel from "../../../src/packages/PlColorPicker/PlColorPanel";
import {DemoLine} from "../../components/DemoLine";

export default designPage(() => {

    const val = reactive({
        val: {
            0: 50,
            1: 240,
        } as any
    }).val

    return () => (
        <div>
            <DemoRow title={'Panel相关'}>
                <DemoRow title={'PlColorAlphaSlider'}>
                    <PlColorAlphaSlider v-model={val[0]} color={'black'} size={180}/>
                    {val[0]}
                </DemoRow>
                <DemoRow title={'PlColorHueSlider'}>
                    <PlColorHueSlider v-model={val[1]} size={240}/>
                    {val[1]}
                </DemoRow>
                <DemoRow title={'PlColorPanel:基本用法'}>
                    <DemoLine>
                        <div style={{backgroundColor: val.color1, width: '100px', height: '30px'}}>
                            {val.color1}
                        </div>
                    </DemoLine>
                    <DemoLine>
                        <PlColorPanel v-model={val.color1} format={'hex'}/>
                    </DemoLine>
                </DemoRow>
                <DemoRow title={'PlColorPanel:透明度'}>
                    <DemoLine>
                        <div style={{backgroundColor: val.color2, width: '100px', height: '30px'}}>
                            {val.color2}
                        </div>
                    </DemoLine>
                    <DemoLine>
                        <PlColorPanel v-model={val.color2} enableAlpha format={'rgb'}/>
                    </DemoLine>
                </DemoRow>
            </DemoRow>

        </div>
    )
})