import React, {useImperativeHandle, useMemo, useRef, useState} from "react";
import {isDom} from "plain-design-composition"

/**
 * 解决输入框光标问题
 * 必须得用fc组件对input、textarea之类的原生组件，或者antd的input之类的受控组件做包装
 * 不然在输入文本的时候，输入中文的时候会多出来空格，在文本中间输入文本的时候光标会自动移动到最后一位
 * @author  韦胜健
 * @date    2021/3/28 11:07
 */
export function fixInputCursor<Component>(component: Component): Component {
    return (React.forwardRef((props: any, ref) => {
        const {value, onChange, ...leftProps} = props
        let [, setText] = useState(value)
        const valRef = useRef(value)
        useMemo(() => {valRef.current = value}, [value])

        const input = useRef<HTMLInputElement>()
        useImperativeHandle(ref, () => input.current, [])
        const Comp = component as any
        return (
            <Comp
                ref={input}
                {...leftProps}
                value={valRef.current || ''}
                onChange={(event: any) => {
                    let value;
                    if (event == null) {
                        value = event;
                    } else if (!!event.target && isDom(event.target)) {
                        // const nativeEvent = event.nativeEvent || event
                        /*修复问题：中文输入法的情况下，每次按键都会增加一个空格*/
                        // if (nativeEvent.inputType === 'insertCompositionText') {return}
                        value = event.target.value;
                    } else {
                        value = event;
                    }
                    setText(value)
                    valRef.current = value
                    !!onChange && onChange(event)
                }}/>
        )
    })) as any
}