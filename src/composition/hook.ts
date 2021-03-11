import {useCallback, useMemo, useRef, useState} from "react";
import {computed, Prop, reactive, watch} from "vue";
import {ComponentPropsOptions, PropConstructor} from "./prop";
import {SimpleFunction} from "./event";

/**
 * hook 强制更新
 * @author  韦胜健
 * @date    2021/3/9 18:14
 */
function useUpdate() {
    const [, setState] = useState(0);

    const update = useCallback(() => {
        setState((val: number) => val + 1);
    }, []);

    return update;
}

/**
 * 监听响应式依赖变化，强制更新render
 * @author  韦胜健
 * @date    2021/3/9 18:15
 */
export function useRender<T>(option: {
    render: () => T,
    memoDependencies: any[],
}) {
    const update = useUpdate();
    const unWatchRef = useRef(null as null | SimpleFunction)
    const renderMemo = useMemo(() => {
        const ref = computed(option.render);
        if (!!unWatchRef.current) {unWatchRef.current()}
        unWatchRef.current = watch(ref, update);
        return ref;
    }, option.memoDependencies)

    return renderMemo.value;
}

/**
 * 执行一次函数参数，但是每次hook都返回第一次的执行结果
 * @author  韦胜健
 * @date    2021/3/9 18:15
 */
export function useOnce<FN extends () => any>(fn: FN): ReturnType<FN> {
    const first = useRef(true)
    const value = useRef<ReturnType<FN>>({} as any)
    if (first.current) {
        first.current = false
        value.current = fn()
    }
    return value.current
}

/**
 * 转化并且校验props
 * @author  韦胜健
 * @date    2021/3/9 18:16
 */
export const useSetupProps = (() => {

    function getTypeName(type: any): string {
        if (Array.isArray(type)) {
            return type.map(t => getTypeName(t)).join(', ')
        } else if (type === true) {
            return 'true'
        } else if (type === false) {
            return 'false'
        } else if (typeof type === "function") {
            return type.name
        }
        return 'unknown'
    }

    function emitCheckError(propName: string, expectType: any, actualType: any, value: any) {
        console.warn(`Invalid prop: type check failed for prop "${propName}". Expected ${getTypeName(expectType)}, got ${getTypeName(actualType)} with value ${value}.`)
    }

    function emitRequiredError(propName: string) {
        console.warn(`Missing required prop: "${propName}"`)
    }

    function checkPropOption(val: any, prop: Prop<Record<string, unknown>> | null, propName: string) {
        if (!prop) return
        if (val === undefined) {
            if (typeof prop === "object" && !Array.isArray(prop) && prop.required) {
                emitRequiredError(propName)
            }
            return;
        }
        if (val === null) {
            return;
        }

        let types: (PropConstructor | true)[] = []
        let type = typeof prop === "object" && !Array.isArray(prop) ? prop.type : prop
        if (typeof type === "function") {
            types = [type]
        } else if (Array.isArray(type)) {
            types = type
        } else if (type === true) {
            types = [true]
        }
        const fit = types.find(t => t === true ? val === true : val.__proto__.constructor === t)
        // console.log('fit', {fit, types, val})
        if (fit == null) {
            emitCheckError(propName, types, val.__proto__.constructor, val)
        }
    }

    return (fcProps: any, propOptions?: Readonly<ComponentPropsOptions>) => {
        const props = useRef({} as any)
        props.current.children = fcProps.children

        if (!!propOptions) {
            if (Array.isArray(propOptions)) {
                // propOptions是一个字符串数组，字符串就是接收的 prop name数组，此时认为所有prop name为任意运行时类型
                // 不检查fcProps中值得类型
                propOptions.forEach(propName => props.current[propName] = fcProps[propName])
            } else {
                Object.entries(propOptions).forEach(([propName, propOption]) => {
                    let val = fcProps[propName]
                    if (props.current[propName] !== val) {
                        /*console.log('check prop', {val, propName, propOption,})*/
                        checkPropOption(val, propOption, propName)
                    }
                    props.current[propName] = val
                })
            }
        }
        const [setupProps] = useState(() => reactive({...props.current}))
        if (!!propOptions) {
            if (Array.isArray(propOptions)) {
                propOptions.forEach((propName: string) => {
                    if (setupProps[propName] !== props.current[propName]) {
                        setupProps[propName] = props.current[propName]
                    }
                })
            } else {
                Object.keys(propOptions).forEach((propName: string) => {
                    if (setupProps[propName] !== props.current[propName]) {
                        setupProps[propName] = props.current[propName]
                    }
                })
            }
        }
        return {
            setupProps,
        }
    }
})();