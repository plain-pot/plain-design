import './color-sv-panel.scss'
import {computed, designComponent, reactive, useNumber, useRefs, useStyles, watch} from "plain-design-composition";
import {hsv2rgb} from "../utils/ColorUtils";
import {unit} from "plain-utils/string/unit";
import {disabledUserSelect} from "plain-utils/dom/disabledUserSelect";
import {enableUserSelect} from "plain-utils/dom/enableUserSelect";
import {delay} from "plain-utils/utils/delay";
import React from 'react';

export const PlColorSvPanel = designComponent({
    name: 'pl-color-sv-panel',
    props: {
        hue: {type: Number, default: 360},                      // 色相
        saturation: {type: Number},                             // 饱和度
        modelValue: {type: Number},                             // 亮度

        height: {type: [String, Number], default: 180},         // 面板高度
        width: {type: [String, Number], default: 240},          // 面板宽度
    },
    inheritPropsType: HTMLDivElement,
    emits: {
        onChange: (val: any) => true,
        onDblclick: (e: React.MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const {numberState} = useNumber(props, ['height', 'width'])

        const state = reactive({
            val: props.modelValue == null ? null : 100 - Number(props.modelValue),
            saturation: props.saturation,

            startX: 0,
            startY: 0,
            tempSaturation: 0,
            tempValue: 0,
        })

        const styles = useStyles(() => {
            const color = hsv2rgb(props.hue, 100, 100)
            return {
                width: unit(numberState.width),
                height: unit(numberState.height),
                backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
            }
        })

        const thumbStyles = computed(() => {
            let {val, saturation} = state
            val = val == null ? 50 : val
            saturation = saturation == null ? 50 : saturation

            return {
                transform: `translate3d(${saturation * (numberState.width as number) / 100}px,${val * (numberState.height as number) / 100}px,0)`,
            }
        })

        const methods = {
            updatePosition: (x: number, y: number, isMouseDown = true): void => {
                const durX = Number((x / (numberState.width as number) * 100).toFixed(0));
                const durY = Number((y / (numberState.height as number) * 100).toFixed(0));

                state.saturation = (isMouseDown ? 0 : state.tempSaturation) + durX
                state.val = (isMouseDown ? 0 : state.tempValue) + durY
                state.saturation = Math.max(0, Math.min(100, state.saturation))
                state.val = Math.max(0, Math.min(100, state.val))

                emit.onChange({hue: props.hue, saturation: state.saturation, value: 100 - state.val})
            },
        }

        const handler = {
            mousedown: (e: React.MouseEvent) => {
                document.body.addEventListener('mousemove', handler.mousemove)
                document.body.addEventListener('mouseup', handler.mouseup)
                disabledUserSelect()
                methods.updatePosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                state.startX = e.clientX
                state.startY = e.clientY
                state.tempSaturation = state.saturation as number
                state.tempValue = state.val as number
            },
            mousemove: (e: MouseEvent) => {
                methods.updatePosition(e.clientX - state.startX, e.clientY - state.startY, false)
            },
            mouseup: () => {
                document.body.removeEventListener('mousemove', handler.mousemove)
                document.body.removeEventListener('mouseup', handler.mouseup)
                enableUserSelect()
            },
            dblclick: async (e: React.MouseEvent) => {
                e.persist()
                delay().then(() => emit.onDblclick(e))
            },
        }

        watch(() => props.modelValue, (val) => {
            if (val == null) {
                state.val = null
                return
            }
            if (state.val !== 100 - val) state.val = 100 - val
        })
        watch(() => props.saturation, (val) => {
            if (val == null) {
                state.saturation = undefined
                return
            }
            if (state.saturation !== val) state.saturation = val
        })

        return {
            refer: {
                refs,
            },
            render: () => (
                <div className="pl-color-sv-panel" style={styles.value} onMouseDown={handler.mousedown} onDoubleClick={handler.dblclick} ref={onRef.el}>
                    <span className="pl-color-sv-thumb" style={thumbStyles.value}/>
                </div>
            )
        }
    },
})