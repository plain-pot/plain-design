import {computed, designComponent, PropType} from "plain-design-composition";
import React from "react";
import {FilterConfig, iFilterOption} from "./FilterConfig";
import PlSelect from "../PlSelect";
import PlSelectOption from "../PlSelectOption";
import PlInputGroup from "../PlInputGroup";
import PlButton from "../PlButton";

export const PlFilter = designComponent({
    props: {
        filterOption: {type: Object as PropType<iFilterOption>, required: true},
    },
    emits: {
        onConfirm: () => true,
    },
    setup: ({props, event: {emit}}) => {

        const optionData = computed(() => {
            const option = FilterConfig.getTargetOption(props.filterOption)
            if (!option) {throw new Error(`pl-filter:无法识别filterOption:${JSON.stringify(props.filterOption)}`)}

            const filter = FilterConfig.touchFilter(option.filterName)
            const handlers = Object.values(filter.handlers)

            return {
                option,
                handlers,
            }
        })

        return () => {
            return (
                <PlInputGroup>
                    <PlSelect v-model={props.filterOption.handlerName} inputProps={{width: 100}}>
                        {optionData.value.handlers.map((handler, index) => <PlSelectOption key={index} label={handler.handlerName} val={handler.handlerName}/>)}
                    </PlSelect>
                    {optionData.value.option.handler.render(optionData.value.option, emit.onConfirm)}
                    <PlButton label="搜索"/>
                </PlInputGroup>
            )
        }
    },
})

export default PlFilter