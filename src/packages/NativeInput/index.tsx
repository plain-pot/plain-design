import React, {useImperativeHandle, useMemo, useRef, useState} from "react";

export const NativeInput: React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (React.forwardRef((props: any, ref) => {
    const {value, onChange, ...leftProps} = props
    let [text, setText] = useState(value)
    useMemo(() => {text = value}, [value])
    const input = useRef<HTMLInputElement>()
    useImperativeHandle(ref, () => input.current, [])
    return (
        <input
            ref={input}
            {...leftProps}
            value={text || ''}
            onChange={e => {
                const val = e.target.value
                setText(val)
                !!onChange && onChange(e)
            }}/>
    )
})) as any