import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import React from "react";
import {PlSelectGroup, PlAutoComplete, PlSelectOption} from "../../../src";
import addressData from '../data/address.json'

export const demo1 = designPage(() => {
    const state = reactive({
        text: ''
    })

    const suggestion = (addressData as any[]).map(({name}) => (name))

    return () => (
        <DemoRow title="基本用法">
            <PlAutoComplete v-model={state.text} suggestion={suggestion}/>
            {state.text}
        </DemoRow>
    )
})

export const demo2 = designPage(() => {
    const state = reactive({
        text: ''
    })

    return () => (
        <DemoRow title="分组，以及自定义内容">
            <PlAutoComplete v-model={state.text}>
                {(addressData as any[]).map((province, groupIndex) => (
                    <PlSelectGroup label={province.name} key={groupIndex}>
                        {(province.children as any[] || []).map((city, index) => (
                            <PlSelectOption key={index} label={city.name + province.name} val={city.name}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>{city.name}</span>
                                    <span style={{color: '#ccc', fontSize: '12px'}}>{city.code}</span>
                                </div>
                            </PlSelectOption>
                        ))}
                    </PlSelectGroup>
                ))}
            </PlAutoComplete>
            {state.text}
        </DemoRow>
    )
})
