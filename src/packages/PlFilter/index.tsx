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
    emits: {
        onConfirm: () => true,
    },
    setup: ({props, event: {emit}}) => {
        return () => {
            if (!props.fto) {return null}
            return (
                <PlInputGroup>
                    <PlSelect
                        v-model={props.fto.option.handlerName}
                        inputProps={{width: 100, clearIcon: false}}
                        filterable={false}
                        onChange={() => props.fto!.option.value = null}
                    >
                        {Object.values(props.fto.filter.handlers).map((handler, index) => <PlSelectOption key={index} label={handler.handlerName} val={handler.handlerName}/>)}
                    </PlSelect>
                    <React.Fragment key={props.fto.option.handlerName}>
                        {props.fto.handler.render(props.fto, emit.onConfirm)}
                        <PlButton label="搜索"/>
                    </React.Fragment>
                </PlInputGroup>
            )
        }
    },
})

export default PlFilter