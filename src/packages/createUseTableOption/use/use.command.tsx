import {KeyBoardMap} from "../../keyboard";
import {tTableOptionHooks} from "./use.hooks";

export function useTableOptionCommand({hooks}: { hooks: tTableOptionHooks }) {

    const state = {
        listener: [] as [string, ((e: KeyboardEvent) => void)][]
    }

    const getMatchHandler = (e: KeyboardEvent) => {
        if (e.currentTarget !== e.target) return
        const names = [] as string[];
        (e.metaKey || e.ctrlKey) && names.push('ctrl')
        e.shiftKey && names.push('shift')
        e.altKey && names.push('alt')
        names.push((KeyBoardMap as any)[e.keyCode])
        const compositionKeyName = names.join('+')

        const listener = [...state.listener]
        let item = listener.shift()
        while (!!item) {
            const [command, handler] = item
            if (command === compositionKeyName) {
                return handler
            } else {
                item = listener.shift()
            }
        }
        return
    }

    const onKeydown = (e: KeyboardEvent) => {
        const handler = getMatchHandler(e)
        if (!!handler) {
            e.stopPropagation()
            e.preventDefault()
        }
    }

    const onKeyup = (e: KeyboardEvent) => {
        const handler = getMatchHandler(e)
        if (!!handler) {handler(e)}
    }

    hooks.onRefTable.use((table) => {
        const el = table.refs.el!
        el.addEventListener('mouseenter', () => {
            document.body.addEventListener('keydown', onKeydown, true)
            document.body.addEventListener('keyup', onKeyup, true)
        })
        el.addEventListener('mouseleave', () => {
            document.body.removeEventListener('keydown', onKeydown, true)
            document.body.removeEventListener('keyup', onKeyup, true)
        })
    })

    const on = (command: string, handler: (e: KeyboardEvent) => void) => {
        state.listener.push([command, handler])
    }

    return {
        on,
    }

}

export type tTableOptionCommand = ReturnType<typeof useTableOptionCommand>