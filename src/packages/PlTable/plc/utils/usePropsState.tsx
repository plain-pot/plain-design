import {computed, reactive, watch} from "plain-design-composition"
import {PlcGroupPropsType, PlcPropsType, tPlcType} from "./plc.type";
import {deepcopy} from "plain-utils/object/deepcopy";

export function usePropsState<Props extends Record<string, any>>(propsRef: { value: Props }): { state: Props, propsState: Props } {

    const state = reactive(Object.keys(propsRef.value).reduce((prev, propKey) => {
        prev[propKey] = undefined
        return prev
    }, {} as any))

    const propsState = reactive(Object.keys(propsRef.value).reduce((prev, propKey) => {

        watch(() => propsRef.value[propKey], () => {(propsState as any)[propKey] = undefined})

        ;(prev as any)[propKey] = computed({
            get() {
                if (state[propKey] !== undefined) {return state[propKey]}
                return propsRef.value[propKey]
            },
            set(val: any) {
                if (state[propKey] !== val) {
                    state[propKey] = val
                }
            },
        })
        return prev
    }, {} as Props))

    return {
        state,
        propsState: propsState as any,
    }
}

export type tPlcState = {
    state: PlcGroupPropsType | PlcPropsType,
    children?: tPlcStateData,
    key: string,
}

export type tPlcStateData = Record<string, tPlcState>

function getPlcKey(i: tPlcType) {
    return i.group ? 'G' + i.props.title || 'GT' : `${i.props.title || 'PT'}_${i.props.field || 'PF'}`
}

/**
 * 获取多级表头的state（只要state）
 * @author  韦胜健
 * @date    2021/6/2 14:58
 */
export function getPropsState(plcList: tPlcType[]): tPlcStateData {
    const stateList = [] as tPlcState[]
    plcList.forEach(i => {
        stateList.push({
            state: deepcopy(i.getState()),
            children: !i.group ? undefined : getPropsState(i.children),
            key: getPlcKey(i),
        })
    })
    return stateList.reduce((prev, item) => {
        prev[item.key] = item
        return prev
    }, {} as Record<string, tPlcState>)
}

/**
 * 应用多级表头的state
 * @author  韦胜健
 * @date    2021/6/2 15:04
 */
export function applyPropsState(stateData: tPlcStateData, plcList: tPlcType[]) {
    plcList.forEach(plcType => {
        const key = getPlcKey(plcType)
        if (!!stateData[key]) {
            Object.assign(plcType.getState(), stateData[key].state)
            if (plcType.group && !!stateData[key].children) {
                applyPropsState(stateData[key].children!!, plcType.children)
            }
        }
    })
}