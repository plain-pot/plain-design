import {designComponent, getCurrentDesignInstance, inject, onBeforeUnmount, onMounted, provide, ref} from "plain-design-composition";
import React from "react";
import {TablePlc} from "./plc.type";

export const usePlcCollector = (() => {
    const ProvideString = '@@TablePlcCollector'
    const useParent = () => {
        const children = ref([] as TablePlc[])
        const refer = {
            children: children.value,
            add: (refer: any) => {
                const el = refer.refs.el
                const index = Array.from(el.parentElement!.childNodes)
                    .filter((item: any) => item.nodeName !== '#comment' && item.nodeName !== '#text' && (!item.style || item.style.display !== 'none'))
                    .indexOf(el)
                children.value.splice(index, 0, refer)
            },
            remove: (refer: any) => {
                const index = children.value.indexOf(refer)
                if (index > -1) {
                    children.value.splice(index, 1)
                }
            },
        }
        provide(ProvideString, refer)
        return refer
    }
    const useChild = () => {
        const {add, remove} = inject(ProvideString) as ReturnType<typeof useParent>
        const ctx = getCurrentDesignInstance()!
        onMounted(() => add(ctx))
        onBeforeUnmount(() => remove(ctx))
        return ctx
    }
    return {
        useParent,
        useChild,
    }
})();

export const PlcCollector = designComponent({
    name: 'plc-collector',
    slots: ['default'],
    setup({slots}) {
        const {children} = usePlcCollector.useParent()
        return {
            refer: {
                children
            },
            render: () => (
                <div className="plc-collector">
                    {slots.default()}
                </div>
            )
        }
    },
})