import {computed, designComponent, getCurrentDesignInstance, useRefs} from "plain-design-composition";
import {StepStatus, StepUtils} from "../PlStepGroup/step.utils";
import useClass from "plain-design-composition/src/use/useClasses";
import React from "react";
import PlIcon from "../PlIcon";
import PlLoading from "../PlLoading";
import {StepCollector} from "../PlStepGroup";

export const PlStep = designComponent({
    name: 'pl-step',
    props: {
        icon: {type: String},
        status: {type: String},
        val: {type: String},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    slots: ['title', 'content', 'default'],
    setup({props, event: {emit}, slots}) {
        const {refs, onRef} = useRefs({
            el: HTMLDivElement
        })
        const stepGroup = StepCollector.child({sort: () => refs.el!})
        const ctx = getCurrentDesignInstance()

        /*---------------------------------------computer-------------------------------------------*/

        const index = computed(() => stepGroup.items.indexOf(ctx.proxy))

        const icon = computed(() => {
            if (!!props.icon) return props.icon
            return null
        })

        const isLast = computed(() => {
            return index.value === stepGroup.items.length - 1
        })

        const currentStatus: { value: StepStatus | null } = computed(() => {
            return StepUtils.getStepStatus({
                currentIndex: stepGroup.currentIndex as any,
                currentStatus: stepGroup.props.currentStatus as any
            }, {
                status: props.status as any,
                index
            })
        })


        const classes = useClass(() => [
            'pl-step',
            `pl-step-status-${currentStatus.value}`,
            {
                'pl-step-has-icon': !!icon.value,
                'pl-step-last': isLast.value,
            }
        ])

        return {
            refer: {},
            render: () => (
                <div className={classes.value} onClick={e => emit.onClick(e.nativeEvent)} ref={onRef.el}>
                    <div className="pl-step-head">
                        {!stepGroup.props.vertical && (stepGroup.isTitleAlignBottom.value || isLast.value) && <span className="pl-step-divider pl-step-divider-prev"/>}
                        <span className="pl-step-icon">
                        {
                            !!icon.value ?
                                (currentStatus.value !== 'process' ? <PlIcon icon={icon.value}/> : <PlLoading type="delta"/>)
                                :
                                (
                                    !!stepGroup.props.dotIcon ?
                                        (<span className="pl-step-dot"/>)
                                        :
                                        (
                                            <span className="pl-step-number">
                                                {currentStatus.value === StepStatus.finish ?
                                                    <PlIcon icon="el-icon-check"/>
                                                    :
                                                    (currentStatus.value === StepStatus.error ?
                                                            <PlIcon icon="el-icon-close"/>
                                                            :
                                                            <span>{index.value + 1}</span>
                                                    )
                                                }
                                            </span>
                                        )
                                )
                        }
                    </span>
                        {!stepGroup.isTitleAlignBottom.value && (
                            <span className="pl-step-title">
                            {slots.title()}
                        </span>
                        )}
                        {(stepGroup.isTitleAlignBottom.value || !isLast.value) && <span className="pl-step-divider pl-step-divider-next"/>}
                    </div>
                    <div className="pl-step-body">
                        {!stepGroup.isTitleAlignBottom.value ?
                            <span className="pl-step-icon"/>
                            :
                            <span className="pl-step-title">
                            {slots.title()}
                        </span>
                        }
                        <span className="pl-step-content">
                        {slots.content()}
                    </span>
                    </div>
                </div>
            )
        }
    },
})