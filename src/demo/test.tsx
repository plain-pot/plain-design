function Test<SlotKeys extends string, ScopeSlot extends { [k: string]: any }>(slots: SlotKeys[], scopeSlot: ScopeSlot):
    { [k in Exclude<SlotKeys, keyof ScopeSlot>]: number } & { [k in Exclude<keyof ScopeSlot, SlotKeys>]: string } {
    return {} as any
}

type A = 'default' extends 'default' | 'name' | 'string' ? number : string
type B = {} & { abc: string, age: number }

const result = Test(['default', 'prepend', 'append'], {
    item: {},
})