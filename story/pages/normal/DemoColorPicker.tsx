import {designPage, onMounted, useRefs} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import PlColorAlphaSlider from "../../../src/packages/PlColorPicker/sub/PlColorAlphaSlider";
import PlColorHueSlider from "../../../src/packages/PlColorPicker/sub/PlColorHueSlider";
import PlColorPanel from "../../../src/packages/PlColorPicker/PlColorPanel";
import {DemoLine} from "../../components/DemoLine";
import useColorPicker from "../../../src/packages/useColorPicker";
import $$message from "../../../src/packages/$$message";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const val = reactive({
        val: {
            0: 50,
            1: 240,
        } as any
    }).val

    const {refs, onRef} = useRefs({
        serviceBasicUsage: {} as any,
        hexValue: {} as any,
        rgbValue: {} as any,
        rgbWithoutOpacity: {} as any,
        hexWithOpacity: {} as any,
        rgbaWithOpacity: {} as any,
        saveValue: {} as any,
    })

    const $colorPicker = useColorPicker()

    const service = {
        serviceBasicUsage: $colorPicker({
            reference: () => refs['serviceBasicUsage'],
            renderAttrs: {
                onChange: val => $$message(val)
            },
        }),
        hexValue: $colorPicker({
            reference: () => refs['hexValue'],
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: '#ff0000',
                format: 'hex',
            },
        }),
        rgbValue: $colorPicker({
            reference: () => refs['rgbValue'],
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: 'rgb(134,74,212)',
                format: 'rgb',
            },
        }),
        rgbWithoutOpacity: $colorPicker({
            reference: () => refs['rgbWithoutOpacity'],
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: 'rgb(134,74,212,0.5)',
                format: 'rgb',
            },
        }),
        hexWithOpacity: $colorPicker({
            reference: () => refs['hexWithOpacity'],
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: '#00ff00',
                format: 'hex',
                enableAlpha: true,
            },
        }),
        rgbaWithOpacity: $colorPicker({
            reference: () => refs['rgbaWithOpacity'],
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: 'rgb(134,74,212,0.5)',
                format: 'rgb',
                enableAlpha: true,
            },
        }),
        saveValue: (() => {
            const option = {
                reference: () => refs['saveValue'],
                renderAttrs: {
                    onChange: (val: any) => option.renderAttrs.modelValue = val,
                    modelValue: 'rgb(134,74,212,0.5)',
                    format: 'rgb',
                    enableAlpha: true,
                },
            }
            return $colorPicker(option)
        })()
    }

    onMounted(() => {
        console.log(refs.serviceBasicUsage)
    })

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
            <DemoRow title={'Service服务'}>
                <DemoRow title={'基本用法'}>
                    <PlButton onClick={service.serviceBasicUsage.toggle} label={'颜色选择服务基本用法'} ref={(refer) => console.log('button', refer)}/>
                </DemoRow>
            </DemoRow>
        </div>
    )
})