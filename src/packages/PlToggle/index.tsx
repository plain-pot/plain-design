import {computed, designComponent, reactive, useModel} from "plain-design-composition"
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {getKey, KEY} from "../keyboard";
import useClass from "plain-design-composition/src/use/useClasses";
import React from "react";
import {useRefs} from "../../use/useRefs";
import {useClickWave} from "../../directives/ClickWave";
import './toggle.scss'

export const PlToggle = designComponent({
    name: 'pl-toggle',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},                                                              // 双向绑定值
        trueValue: {default: true as any},                                           // 选中时绑定的值
        falseValue: {default: false as any},                                         // 未选中时绑定的值
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onMousedown: (e: MouseEvent) => true,
        onMouseup: (e: MouseEvent) => true,
        onClick: (e: MouseEvent) => true,
        onFocus: (e: Event) => true,
        onBlur: (e: Event) => true,
    },
    setup({props, event: {emit}}) {

        /*---------------------------------------state-------------------------------------------*/

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const state = reactive({
            isActive: false,
        })

        /*---------------------------------------computer-------------------------------------------*/

        const isChecked = computed(() => model.value === props.trueValue)

        const classes = useClass(() => ([
            `pl-toggle`,
            `plain-click-node`,
            `pl-toggle-status-${styleComputed.value.status}`,
            `pl-toggle-size-${styleComputed.value.size}`,
            {
                'pl-toggle-on': isChecked.value,
                'pl-toggle-active': state.isActive,
                'pl-toggle-disabled': editComputed.value.disabled,
            },
        ]))

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            mousedown: (e: React.MouseEvent) => {
                state.isActive = true
                window.addEventListener('mouseup', handler.mouseup)
                emit.onMousedown(e.nativeEvent)
            },
            mouseup: (e: MouseEvent) => {
                state.isActive = false
                window.removeEventListener('mouseup', handler.mouseup)
                emit.onMouseup(e)
            },
            click: (e: React.MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                model.value = isChecked.value ? props.falseValue : props.trueValue
                emit.onClick(e.nativeEvent)
            },
            keydown: (e: React.KeyboardEvent) => {
                const key = getKey(e.nativeEvent)
                if (key === KEY.space || key === KEY.enter) {
                    e.preventDefault()
                    e.stopPropagation()
                    handler.click(e.nativeEvent as any)
                }
            },
            focus: emit.onFocus,
            blur: emit.onBlur,
        }

        useClickWave({elGetter: () => refs.el, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable})})

        return {
            render: () => (
                <div
                    ref={onRef.el}
                    className={classes.value}
                    tabIndex={0}
                    onMouseDown={handler.mousedown}
                    onClick={handler.click}
                    onKeyDown={handler.keydown}
                    onFocus={e => handler.focus(e.nativeEvent)}
                    onBlur={e => handler.blur(e.nativeEvent)}>
                    <div className="pl-toggle-inner"/>
                </div>
            )
        }
    },
})

export default PlToggle