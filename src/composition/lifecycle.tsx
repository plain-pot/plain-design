import {TopDesign} from "./context";

type Listener = () => any

export interface ContextLifecycle {
    onBeforeMount: (listener: Listener) => void,                                  // 挂载到dom对象之前
    onBeforeUnmount: (listener: Listener) => void,                                // 卸载dom对象之前
    onBeforeUpdate: (listener: Listener) => void,                                 // 更新前
    onMounted: (listener: Listener) => void,                                      // 挂载到dom对象之后
    // onUnmounted: (listener: Listener) => void,                                    // 卸载dom对象之后
    onUpdated: (listener: Listener) => void,                                      // 更新之后
}

function createListenerManager() {
    const listeners: (() => void)[] = []
    return {
        listeners,
        on: (cb: () => void) => listeners.push(cb),
        emit: () => listeners.forEach(cb => cb()),
    }
}

export function createCtxLifeCycle() {
    const onBeforeMount = createListenerManager()
    const onBeforeUnmount = createListenerManager()
    const onBeforeUpdate = createListenerManager()
    const onMounted = createListenerManager()
    const onUpdated = createListenerManager()
    return {
        lifecycleManager: {
            onBeforeMount,
            onBeforeUnmount,
            onBeforeUpdate,
            onMounted,
            onUpdated,
        },
        lifecycle: {
            onBeforeMount: onBeforeMount.on,
            onBeforeUnmount: onBeforeUnmount.on,
            onBeforeUpdate: onBeforeUpdate.on,
            onMounted: onMounted.on,
            onUpdated: onUpdated.on,
        }
    }
}

export function onBeforeMount(cb: () => void) {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行onBeforeMount函数')}
    return TopDesign.ctx.lifecycle.onBeforeMount(cb)
}

export function onBeforeUnmount(cb: () => void) {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行onBeforeUnmount函数')}
    return TopDesign.ctx.lifecycle.onBeforeUnmount(cb)
}

export function onBeforeUpdate(cb: () => void) {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行onBeforeUpdate函数')}
    return TopDesign.ctx.lifecycle.onBeforeUpdate(cb)
}

export function onMounted(cb: () => void) {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行onMounted函数')}
    return TopDesign.ctx.lifecycle.onMounted(cb)
}

export function onUpdated(cb: () => void) {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行onUpdated函数')}
    return TopDesign.ctx.lifecycle.onUpdated(cb)
}