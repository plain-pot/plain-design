import {onBeforeUnmount, watch} from "plain-design-composition";
import {delay} from "plain-utils/utils/delay";

export interface ResizeDetectFuncParam {
    width?: number
    height?: number
    oldWidth?: number
    oldHeight?: number
    el?: HTMLElement

    [key: string]: any
}

export interface ResizeDetectFunc {
    (option: ResizeDetectFuncParam): void
}

export default class ResizeDetector {

    observer?: MutationObserver
    width?: number
    height?: number

    constructor(public el: HTMLElement, public callback: ResizeDetectFunc) {

        if (!el) {
            console.error(`el is ${typeof el}`)
            return
        }

        this.observer = new MutationObserver(this.detect)

        this.observer.observe(el, {
            childList: true,
            subtree: true
        })

        // const {width, height} = el.getBoundingClientRect()
        const {scrollHeight: height, scrollWidth: width} = el
        this.width = width
        this.height = height
        this.runCallback({
            width,
            height,
            el
        })
    }

    detect = () => {
        // const {width, height} = this.el.getBoundingClientRect()
        const {scrollHeight: height, scrollWidth: width} = this.el
        if (width === this.width && height === this.height) return
        const ret = {} as ResizeDetectFuncParam
        if (width !== this.width) {
            ret.width = width
            ret.oldWidth = this.width
            this.width = width
        }
        if (height !== this.height) {
            ret.height = height
            ret.oldHeight = this.height
            this.height = height
        }
        this.runCallback(ret)
    }

    runCallback(data: ResizeDetectFuncParam) {
        Object.keys(data).forEach(key => {
            if (data[key] != null && typeof data[key] === 'number') data[key] = Math.ceil(data[key])
        })
        this.callback(data)
    }

    destroy() {
        if (!!this.observer) {
            this.observer.disconnect();
            this.observer = undefined
        }
    }
}

export function useResizeDetector(
    {
        elGetter,
        onResize,
    }: {
        elGetter: () => HTMLElement | undefined | null,
        onResize: (data: ResizeDetectFuncParam) => void,
    }) {

    const state = {
        resizeDetector: null as null | ResizeDetector,
    }

    watch(elGetter, async el => {
        await delay(0)
        if (!!state.resizeDetector) {state.resizeDetector.destroy()}
        state.resizeDetector = null
        !!el && (state.resizeDetector = new ResizeDetector(el, onResize))
    }, {immediate: true})

    !!state.resizeDetector && state.resizeDetector.detect()

    onBeforeUnmount(() => {!!state.resizeDetector && state.resizeDetector.destroy()})

}

