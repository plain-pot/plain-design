import React, {useImperativeHandle, useMemo, useRef, useState} from "react";
import {isDom} from "plain-design-composition/src/composition/utils";

export function fixInputCursor<Component>(component: Component): Component {
    return (React.forwardRef((props: any, ref) => {
        const {value, onChange, ...leftProps} = props
        let [text, setText] = useState(value)
        useMemo(() => {text = value}, [value])
        const input = useRef<HTMLInputElement>()
        useImperativeHandle(ref, () => input.current, [])
        const Comp = component as any
        return (
            <Comp
                ref={input}
                {...leftProps}
                value={text || ''}
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
                    !!onChange && onChange(event)
                }}/>
        )
    })) as any
}