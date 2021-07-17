import {tUseTableOption} from "../createUseTableOption";

export interface InitializeConfigState {
    useTableOption: tUseTableOption,
    useObjectOption: tUseTableOption,
}

let state: InitializeConfigState | null = null

export function initialize(getter: () => InitializeConfigState) {state = getter()}

export function getInitialConfigState<K extends keyof InitializeConfigState>(k: K) {
    if (!state) {throw new Error('请先调用 initialize 初始化 InitializeConfigState')}
    return state[k]
}

export default initialize