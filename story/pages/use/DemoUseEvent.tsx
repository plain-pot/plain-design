import {designComponent, onBeforeUnmount, onMounted, reactive} from "plain-design-composition"
import React from "react"
import {useRefs} from "../../../src/use/useRefs";
import {createEventListener} from "../../../src/utils/createEventListener";
import './DemoUseEvent.scss'

export enum DemoUseEventTablePart {
    head = 'head',
    body = 'body',
}

export const DemoUseEventTableHead = designComponent({
    emits: {
        onClickHeader: (tag: number) => true,
    },
    setup() {

        const {refs, onRef} = useRefs({
            wrapper: HTMLDivElement,
        })
        const table = DemoUseEventTable.use.inject()

        const handler = {
            /**
             * 组件销毁的时候，如果不取消监听事件，则监听的事件一直有效
             * 此时 wrapperEl  节点已经销毁，会导致一直报错
             * @author  韦胜健
             * @date    2020/10/29 16:14
             */
            scroll: (e: Event, part: DemoUseEventTablePart) => {
                // console.log('head handle scroll', Date.now())
                if (part === DemoUseEventTablePart.body) {
                    refs.wrapper!.scrollLeft = (e.target as HTMLDivElement).scrollLeft
                }
            },
            wrapperScroll: (e: React.UIEvent<HTMLDivElement>) => {
                if (table.state.hoverPart === DemoUseEventTablePart.head) {
                    table.event.emit.onScroll(e.nativeEvent, DemoUseEventTablePart.head)
                }
            },
            mousewheel: (e: WheelEvent) => {
                e.preventDefault()
                e.stopPropagation()
                refs.wrapper!.scrollLeft = refs.wrapper!.scrollLeft + e.deltaY
            }
        }

        table.event.on.onScroll(handler.scroll)
        onMounted(() => {
            refs.wrapper!.addEventListener('wheel', handler.mousewheel, {passive: false})
        })
        onBeforeUnmount(() => {
            refs.wrapper!.removeEventListener('wheel', handler.mousewheel)
            table.event.off.onScroll(handler.scroll)
        })

        return {
            render: () => (
                <div className="demo-use-event-table-head"
                     ref={onRef.wrapper}
                     onScroll={handler.wrapperScroll}>
                    <div className="demo-use-event-table-head-inner">
                        table head
                    </div>
                </div>
            )
        }
    },
})

export const DemoUseEventTableBody = designComponent({
    setup() {

        const {refs, onRef} = useRefs({
            wrapper: HTMLDivElement,
        })
        const table = DemoUseEventTable.use.inject()

        const handler = {
            scroll: (e: Event, part: DemoUseEventTablePart) => {
                if (part === DemoUseEventTablePart.head) {
                    refs.wrapper!.scrollLeft = (e.target as HTMLDivElement).scrollLeft
                }
            },
            wrapperScroll: (e: React.UIEvent<HTMLDivElement>) => {
                if (table.state.hoverPart === DemoUseEventTablePart.body) {
                    table.event.emit.onScroll(e.nativeEvent, DemoUseEventTablePart.body)
                }
            },
            mousewheel: (e: WheelEvent) => {
                if (e.altKey) {
                    refs.wrapper!.scrollLeft = refs.wrapper!.scrollLeft + e.deltaY
                    e.preventDefault()
                    e.stopPropagation()
                }
            }
        }

        table.event.on.onScroll(handler.scroll)
        onMounted(() => {
            refs.wrapper!.addEventListener('wheel', handler.mousewheel, {passive: false})
        })
        onBeforeUnmount(() => {
            table.event.off.onScroll(handler.scroll)
            refs.wrapper!.removeEventListener('wheel', handler.mousewheel)
        })

        return {
            render: () => (
                <div className="demo-use-event-table-body"
                     ref={onRef.wrapper}
                     onScroll={handler.wrapperScroll}>
                    <div className="demo-use-event-table-body-inner">
                        table <br/> body
                    </div>
                </div>
            )
        }
    },
})

export const DemoUseEventTable = designComponent({
    name: 'demo-sue-event-table',
    props: {
        showHeader: {type: Boolean, default: true},
    },
    emits: {
        onScroll: (e: Event, part: DemoUseEventTablePart) => true,
    },
    provideRefer: true,
    setup({props, event}) {

        const state = reactive({
            hoverPart: null as null | DemoUseEventTablePart
        })

        return {
            refer: {
                state,
                event,
            },
            render: () => (
                <div className="demo-use-event-table" onMouseLeave={() => state.hoverPart = null}>

                    {!!props.showHeader &&
                    <DemoUseEventTableHead
                        onClickHeader={(name) => {
                            name.toFixed(1)
                        }}
                        {...createEventListener({
                            onMouseEnter: () => state.hoverPart = DemoUseEventTablePart.head,
                        })}
                    />}

                    <DemoUseEventTableBody {...createEventListener({
                        onMouseEnter: () => state.hoverPart = DemoUseEventTablePart.body
                    })}/>

                </div>
            )
        }
    },
})

export default designComponent({
    setup() {

        const state = reactive({
            showHeader: true,
            currentPart: null as null | DemoUseEventTablePart,
            count: 0,
            init: true,

            tips: [
                {label: '使用鼠标的滚轮进行纵向滚动', done: false},
                {label: '拖拽横向滚动条横向联动滚动', done: false},
                {label: '在表头、表体使用触摸板横向，以及纵向滚动', done: false},
                {label: '在表头使用鼠标滚动横向滚动', done: false},
                {label: '在表体使用 alt+鼠标滚动 横向滚动', done: false},
            ],
        })

        const handler = {
            onScroll: (e: Event, part: DemoUseEventTablePart) => {
                if (part === state.currentPart) {
                    state.count++
                } else {
                    state.currentPart = part
                    state.count = 0
                }
            },
            log(...args: any[]) {
                console.log(...args)
            },
        }

        return () => (
            <div>
                <div style={{
                    display: 'inline-block',
                    width: '360px',
                }}>
                    <div>
                        当前滚动位置:{!!state.currentPart ? `${state.currentPart} (${state.count})` : '无'}
                    </div>
                    <h3>
                        <input type="checkbox" id="showHeader" checked={state.showHeader} onChange={e => state.showHeader = e.target.checked}/>
                        <label htmlFor="showHeader">showHeader</label>
                    </h3>
                    <DemoUseEventTable onScroll={handler.onScroll} showHeader={state.showHeader}/>
                </div>
                <ul style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                }}>
                    {state.tips.map(tip => (
                        <div key={tip.label}>
                            {!tip.done && <button onClick={() => tip.done = true}>done</button>}
                            <span>{tip.label}</span>
                        </div>
                    ))}
                </ul>
            </div>
        )
    },
})