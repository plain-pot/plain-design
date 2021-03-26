import './collapse.scss'
import {createCounter} from "plain-design-composition/src/utils/createCounter";
import {computed, designComponent, useModel, useRefs} from "plain-design-composition";
import PlCollapseGroup from "../PlCollapseGroup";
import useClass from "plain-design-composition/src/use/useClasses";
import React from 'react';
import PlIcon from "../PlIcon";
import PlCollapseTransition from "../PlCollapseTransition";

const valCounter = createCounter('collapse')

export const PlCollapse = designComponent({
    name: 'pl-collapse',
    props: {
        modelValue: {type: Boolean, default: true},
        detail: {type: String},
        noArrow: {type: Boolean},
        disabled: {type: Boolean, default: null},
        val: {type: String},
    },
    emits: {
        onUpdateModelValue: (val: boolean) => true
    },
    slots: [
        'default',
        'title',
    ],
    setup({props, event: {emit}, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const group = PlCollapseGroup.use.inject(null)

        const selfVal = computed(() => props.val || valCounter())

        const isOpen = computed(() => {
            if (!!group) {
                return group.utils.isOpen(selfVal.value)
            } else {
                return model.value
            }
        })

        const classes = useClass(() => [
            'pl-collapse',
            {
                'pl-collapse-has-arrow': !props.noArrow,
                'pl-collapse-is-open': isOpen.value,
            }
        ])

        const isDisabled = computed(() => {
            if (props.disabled != null) {
                return props.disabled
            }
            if (!!group) {
                return group.props.disabled
            }
            return false
        })

        const handler = {
            onClickTitle: () => {
                if (isDisabled.value) {
                    return
                }
                if (!!group) {
                    group.handler.clickCollapseTitle(selfVal.value)
                } else {
                    model.value = !model.value
                }
            }
        }

        return {
            refer: {refs},
            render: () => (
                <div className={classes.value} ref={onRef.el}>
                    {(slots.title.isExist()) && <div className="pl-collapse-title" onClick={handler.onClickTitle}>
                        {slots.title()}

                        {!props.noArrow && !isDisabled.value && <div className="pl-collapse-arrow">
                            <PlIcon icon="el-icon-arrow-right"/>
                        </div>}
                    </div>}
                    <PlCollapseTransition show={isOpen.value && (!!props.detail || slots.default.isExist())}>
                        <div className="pl-collapse-detail">
                            {slots.default(props.detail)}
                        </div>
                    </PlCollapseTransition>
                </div>
            )
        }
    },
})

export default PlCollapse