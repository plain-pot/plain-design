import {computed, reactive} from "plain-design-composition";
import {tTableOptionMethods} from "./use.methods";
import {tTableOptionHooks} from "./use.hooks";

export interface iTableOptionSortData {
    field: string,
    title: string,
    desc: boolean,
    seq: number,
}

export function useTableOptionSort({hooks, methods}: { hooks: tTableOptionHooks, methods: tTableOptionMethods }) {

    const state = reactive({
        data: [] as iTableOptionSortData[],
    })

    const seqData = computed(() => state.data.reduce((prev, item) => {
        prev.max = Math.max(prev.max, item.seq)
        prev.min = Math.min(prev.min, item.seq)
        return prev
    }, {max: 1, min: 1}))

    const toggleSort = ({field, title, desc}: Omit<iTableOptionSortData, 'seq'>, config?: { first?: boolean, reload?: boolean }) => {

        config = config || {}

        const existIndex = state.data.findIndex(i => i.title === title && i.field === field)
        const exist = state.data[existIndex]
        if (!!exist) {
            if (exist.desc === desc) {
                state.data.splice(existIndex, 1)
            } else {
                exist.desc = desc
            }
        } else {
            state.data.push({title, field, desc, seq: config.first ? seqData.value.min : seqData.value.max})
        }

        config.reload !== false && (methods.pageMethods.reload())
    }

    const get = ({field, title}: { title: string, field: string }): iTableOptionSortData | undefined => state.data.find(i => i.field === field && i.title === title)

    const sortData = computed(() => state.data.sort((a, b) => a.seq - b.seq))

    hooks.onCollectSortData.use((prev) => [...(sortData.value.map(i => ({field: i.field, desc: i.desc}))), ...prev,])

    return {
        toggleSort,
        get,
        sortData,
    }
}

export type tTableOptionSort = ReturnType<typeof useTableOptionSort>