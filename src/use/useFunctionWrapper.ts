import {getCurrentDesignInstance} from 'plain-design-composition'

export function useFunctionWrapper<P extends any[],
    T extends (ctx: any, ...args: P) => any>(
    key: string,
    func: T,
): (...args: P) => ReturnType<T> {
    return (...args) => {
        const ctx = getCurrentDesignInstance() as any
        if (!ctx._use) ctx._use = {}

        if (!!ctx._use[key]) {
            throw new Error(`use ${key} can only be executed once!`)
        }

        return (ctx._use[key] = func(ctx, ...args))
    }
}

/*const func = useFunctionWrapper('', (ctx, name: string, age: number) => {
    return {
        sayHello: () => {},
    }
})

const data = func('111', 111)
data.sayHello()*/

