import {computed, designComponent, reactive, useNumber, useStyles, watch} from 'plain-design-composition'
import './PlButton.scss'
import {PropType} from "plain-design-composition/src/composition/prop-type";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {SimpleFunction} from 'plain-design-composition/src/composition/event';
import {throttle} from 'plain-utils/utils/throttle'
import {unit} from 'plain-utils/string/unit'
import React from 'react';
import useClass from "plain-design-composition/src/use/useClasses";
import {PlLoading} from "../PlLoading/PlLoading";
import {PlIcon} from "../PlIcon/PlIcon";
import {EditProps, useEdit} from "../../use/useEdit";
import {ButtonModeProvider} from "../PlButtonGroup/PlButtonGroup";
import {useClickWave} from "../../directives/ClickWave";
import {useRefs} from "../../use/useRefs";

console.log('load button component')

export const PlButton = designComponent({
    name: 'pl-button',
    props: {
        mode: {type: String, default: 'fill'},                  // fill,stroke,text
        label: {type: String},                                  // 按钮文本
        width: {type: [String, Number]},                        // 按钮宽度
        icon: {type: String},                                   // 按钮图标
        active: {type: Boolean},                                // 按钮是否高亮
        noPadding: {type: Boolean},                             // 按钮是否无边距
        block: {type: Boolean},                                 // 块级元素
        throttleClick: {type: [Boolean, Number]},               // click节流
        asyncHandler: {type: Function as PropType<(e: MouseEvent) => void>},    // 异步处理函数，会自动开启关闭loading状态

        ...EditProps,
        ...StyleProps,

        /*native*/
        type: {type: String, default: 'button'},
        nativeAttrs: {type: Object},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    slots: ['default'],
    setup({props, event: {emit}, slots}) {

        const {refs, onRef} = useRefs({
            button: HTMLButtonElement,
        })
        const {numberState} = useNumber(props, ['width'])

        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const {editState, editComputed} = useEdit()
        const buttonGroup = ButtonModeProvider.inject()
        const otherComputed = computed(() => ({
            mode: !!buttonGroup ? buttonGroup.value.mode : props.mode
            // mode: 'fill',
        }))
        const state = reactive({
            handleClick: null as SimpleFunction | null,
            handleClickInner: async (e: MouseEvent) => {
                e.stopPropagation()
                if (!editComputed.value.editable) {
                    return
                }
                if (!props.asyncHandler) {
                    return emit.onClick(e)
                }
                editState.loading = true
                try {
                    await props.asyncHandler(e)
                } catch (e) {
                    console.error(e)
                } finally {
                    editState.loading = null
                }
            },
        })

        watch(
            () => props.throttleClick,
            (val) => {
                if (!val) {
                    return state.handleClick = state.handleClickInner
                }
                if (val === true) {
                    val = 1000
                }
                state.handleClick = throttle(state.handleClickInner, val, {trailing: false})
            },
            {immediate: true}
        )

        const classes = useClass(() => ([
            'pl-button',
            'plain-click-node',

            `pl-button-mode-${otherComputed.value.mode}`,
            `pl-button-status-${styleComputed.value.status}`,
            `pl-button-shape-${styleComputed.value.shape}`,
            `pl-button-size-${styleComputed.value.size}`,

            {
                'pl-button-icon': !!props.icon,
                'pl-button-active': !!props.active,
                'pl-button-noPadding': !!props.noPadding,

                'pl-button-loading': !!editComputed.value.loading,
                'pl-button-has-icon': !!props.icon,
                'pl-button-block': !!props.block,
                'pl-button-disabled': !!editComputed.value.disabled,
                'pl-button-icon-only': !!props.icon && !props.label,
            },
        ]))

        const styles = useStyles(style => {
            style.width = unit(numberState.width)
        })

        useClickWave({elGetter: () => refs.button, optionsGetter: () => 'large',})

        return {
            render: () => {
                return (
                    <button
                        ref={onRef.button}
                        style={styles.value}
                        className={classes.value}
                        type={props.type as any}
                        disabled={editComputed.value.disabled!}
                        {...{
                            ...(props.nativeAttrs || {}),
                            onClick: state.handleClick!,
                        }}
                    >
                        {!!editComputed.value.loading && <PlLoading type="gamma"/>}
                        {
                            slots.default(<>
                                {(!!props.icon && !editComputed.value.loading) ? <PlIcon icon={props.icon}/> : null}
                                {props.label ? <span>{props.label}</span> : null}
                            </>)
                        }
                    </button>
                )
            }
        }
    },
})