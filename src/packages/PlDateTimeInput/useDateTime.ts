import {ModelType} from "../../shims";
import {EditPopperAgent} from "../useEditPopperAgent/useEditPopperAgent";
import {useStyle} from "../../use/useStyle";
import {computed, useRefs} from "plain-design-composition";
import {PlDateTimeInput} from "./index";
import {PlInput} from "../PlInput";
import {delay} from "plain-utils/utils/delay";
import {handleKeyboard} from "../keyboard";
import React from "react";

export function useDateTime(
    {
        value,
        start,
        end,
        props,
        agentState,
        emit,
    }: {
        value: ModelType,
        start: ModelType,
        end: ModelType,
        props: {
            range?: boolean,
        },
        agentState: EditPopperAgent,
        emit: {
            onBlur: Function
        },
    }
) {

    useStyle()

    const {refs, onRef} = useRefs({
        valueInput: PlDateTimeInput,
        startInput: PlDateTimeInput,
        endInput: PlDateTimeInput,
        plInput: PlInput,
    })

    const inputValue = computed(() => {
        return !props.range ? value.value : ((start.value || '') + (end.value || ''))
    })

    const handler = {
        clearHandler: () => {
            if (!props.range) {
                value.value = null
            } else {
                start.value = null
                end.value = null
            }
        },
        clickInput() {
            if (!props.range) {
                agentState.methods.toggle()
            } else {
                agentState.methods.show()
            }
        },
        customInputFocus(e: React.FocusEvent) {
            agentState.inputHandler.onFocus(e)
        },
        async customInputBlur(e: React.FocusEvent) {
            if (!props.range) {
                agentState.inputHandler.onBlur(e)
            } else {
                await delay(0)
                if ([
                    refs.startInput!.refs.input,
                    refs.endInput!.refs.input,
                ].indexOf(document.activeElement as any) === -1) {
                    agentState.state.focusCounter--
                    if (agentState.state.focusCounter === 0) {
                        emit.onBlur()
                        agentState.methods.hide()
                    }
                }
            }
        },
        keydown: handleKeyboard({
            enter: agentState.inputHandler.onEnter,
            esc: agentState.inputHandler.onEsc,
        })
    }

    return {
        refs,
        inputValue,
        handler,
        onRef,
    }

}