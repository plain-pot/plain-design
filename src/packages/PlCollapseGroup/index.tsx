import {designComponent, useModel} from "plain-design-composition";
import React from "react";

export const PlCollapseGroup = designComponent({
    name: 'pl-collapse-group',
    props: {
        modelValue: {type: [String, Array]},
        limit: {type: Number, default: 1},
        disabled: {type: Boolean},
    },
    provideRefer: true,
    emits: {
        onUpdateModelValue: (val: string | string[] | undefined) => true
    },
    slots: ['default'],
    setup({props, event: {emit}, slots}) {
        const model = useModel(() => props.modelValue as string | string[] | undefined, emit.onUpdateModelValue)

        const utils = {
            isOpen: (val: string) => {
                if (!model.value) {
                    return
                }
                if (typeof model.value === "string") {
                    return model.value == val
                } else {
                    return (model.value as string[]).indexOf(val) > -1
                }
            }
        }

        const handler = {
            clickCollapseTitle: (val: string) => {
                if (props.limit === 1) {
                    model.value = val == model.value ? undefined : val
                } else {
                    const value = (model.value as string[] | undefined) || []
                    const index = value.indexOf(val)
                    if (index > -1) {
                        value.splice(index, 1)
                    } else {
                        value.push(val)
                    }
                    model.value = [...value]
                }
            },
        }

        return {
            refer: {
                utils,
                handler,
                props,
                model,
            },
            render: () => (
                <div className="pl-collapse-group">
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlCollapseGroup