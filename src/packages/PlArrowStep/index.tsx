import {computed, designComponent, getCurrentDesignInstance, useRefs} from "plain-design-composition";
import {ArrowStepCollector} from "../PlArrowStepGroup";
import {StepStatus, StepUtils} from "../PlStepGroup/step.utils";
import useClass from "plain-design-composition/src/use/useClasses";
import React from "react";
import PlTriangle from "../PlTriangle";

export const PlArrowStep = designComponent({
    name: 'pl-arrow-step',
    props: {
        status: {type: String},
        title: {type: String},
        val: {type: String},
        hideIndex: {type: Boolean},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    slots: ['default'],
    setup({props, event: {emit}, slots}) {
        const ctx = getCurrentDesignInstance()
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const stepGroup = ArrowStepCollector.child({sort: () => refs.el!})
        /*---------------------------------------computer-------------------------------------------*/

        const index = computed(() => {
            return stepGroup.items.indexOf(ctx.proxy)
        }) as { value: number }

        const isLast = computed(() => {
            return index.value === stepGroup.items.length - 1
        })

        const isFirst = computed(() => {
            return index.value === 0
        })

        const currentStatus: { value: StepStatus | null } = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex as any,
                currentStatus: stepGroup.props.currentStatus as any
            }, {
                status: props.status as any,
                index: index as any
            })
        })

        const classes = useClass(() => [
            'pl-arrow-step',
            `pl-arrow-step-status-${currentStatus.value}`,
        ])

        return {
            refer: {},
            render: () => (
                index.value != null ? (
                    <div className={classes.value} onClick={e => emit.onClick(e.nativeEvent)} ref={onRef.el}>
                        <div className="pl-arrow-step-content">
                            {!props.hideIndex && <span className="pl-arrow-step-sequence">{index.value + 1}. &nbsp;</span>}
                            <span>{slots.default() || props.title}</span>
                        </div>
                        {!isLast.value && <PlTriangle direction="right" size={null as any}/>}
                        {!isFirst.value && <>
                            <PlTriangle direction="bottom" half="start" size={null as any}/>
                            <PlTriangle direction="top" half="start" size={null as any}/>
                        </>}
                    </div>
                ) : <div/>
            )
        }
    },
})

export default PlArrowStep