import './arrow-step.scss'
import {useCollect} from "../../use/useCollect";
import {PlArrowStep} from "../PlArrowStep";
import {computed, designComponent} from "plain-design-composition";
import {StepUtils} from "../PlStepGroup/step.utils";
import React from 'react';

export const PlArrowStepGroup = designComponent({
    name: 'pl-arrow-step-group',
    props: {
        current: {},
        currentStatus: {type: String},
    },
    slots: ['default'],
    setup({props, slots}) {
        const items = ArrowStepCollector.parent() as any[]
        const currentIndex = computed(() => StepUtils.getCurrentIndex(props.current, items)) as { value: number }
        return {
            refer: {
                props,
                currentIndex,
                items,
            },
            render: () => (
                <div className="pl-arrow-step-group">
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlArrowStepGroup

export const ArrowStepCollector = useCollect(() => ({
    parent: PlArrowStepGroup,
    child: PlArrowStep,
}))