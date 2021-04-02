import {designComponent, useRefs} from "plain-design-composition";
import PlDropdownMenu from "../PlDropdownMenu";
import {useClasses} from "plain-design-composition";
import React from "react";
import PlIcon from "../PlIcon";

export const PlDropdownOption = designComponent({
    name: 'pl-dropdown-option',
    props: {
        label: {type: [String]},
        val: {},
        icon: {type: String},
        disabled: {type: Boolean},
        align: {type: String, default: 'left'},
    },
    emits: {
        onClick: (e: React.MouseEvent) => true,
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const menu = PlDropdownMenu.use.inject()

        const onClick = (e: React.MouseEvent) => {
            if (props.disabled) {
                return
            }
            emit.onClick(e)
            menu.handler.clickOption(e, props.val)
        }

        const classes = useClasses(() => [
            'pl-dropdown-option',
            `pl-dropdown-option-align-${props.align}`,
            {
                'pl-dropdown-option-disabled': props.disabled
            }
        ])

        return {
            refer: {
                refs,
            },
            render: () => (
                <div className={classes.value} onClick={onClick} ref={onRef.el}>
                    {!!props.icon && <PlIcon icon={props.icon} className="pl-dropdown-option-icon"/>}
                    {slots.default(props.label)}
                </div>
            )
        }
    },
})

export default PlDropdownOption