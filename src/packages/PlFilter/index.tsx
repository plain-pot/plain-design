import {designComponent, PropType} from "plain-design-composition";
import React from "react";
import {iFilterTargetOption} from "./FilterConfig";
import PlSelect from "../PlSelect";
import PlSelectOption from "../PlSelectOption";
import PlInputGroup from "../PlInputGroup";
import PlButton from "../PlButton";

export const PlFilter = designComponent({
    props: {
        fto: {type: Object as PropType<iFilterTargetOption>},

    },
    slots: ['prepend', 'append'],
    emits: {
        onConfirm: () => true,
        onHandlerNameChange: (handlerName: string) => true,
    },
    setup: ({props, slots, event: {emit}}) => {

        const onHandlerNameChange = (handlerName: string) => {
            !!props.fto && (props.fto.option.value = null)
            emit.onHandlerNameChange(handlerName)
        }

        return () => {
            if (!props.fto) {return null}
            return (
                <PlInputGroup>
                    {slots.prepend()}
                    <PlSelect
                        v-model={props.fto.option.handlerName}
                        inputProps={{width: 80, clearIcon: false}}
                        filterable={false}
                        onChange={onHandlerNameChange as any}
                    >
                        {Object.values(props.fto.filter.handlers).map((handler, index) => <PlSelectOption key={index} label={handler.handlerName} val={handler.handlerName}/>)}
                    </PlSelect>
                    <React.Fragment key={props.fto.option.filterName + props.fto.option.handlerName}>
                        {props.fto.handler.render(props.fto, emit.onConfirm)}
                        <PlButton label="搜索"/>
                    </React.Fragment>
                    {slots.append()}
                </PlInputGroup>
            )
        }
    },
})

export default PlFilter