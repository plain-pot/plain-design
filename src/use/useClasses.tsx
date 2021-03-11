import {computed} from 'vue'
import classnames from 'classnames'

export type SingleClass = null | undefined | string | { [k: string]: boolean | null | undefined }
export type MultipleClass = SingleClass | SingleClass[]

export default function useClass<T extends () => MultipleClass>(fn: T) {
    return computed(() => classnames(fn()))
}