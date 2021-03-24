import {designComponent} from "plain-design-composition";
import PlDropdownMenu from "../PlDropdownMenu";
import useClass from "plain-design-composition/src/use/useClasses";
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
        onClick: (e: MouseEvent) => true,
    },
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const menu = PlDropdownMenu.use.inject()

        const onClick = (e: React.MouseEvent) => {
            if (props.disabled) {
                return
            }
            emit.onClick(e.nativeEvent)
            menu.handler.clickOption(e.nativeEvent, props.val)
        }

        const classes = useClass(() => [
            'pl-dropdown-option',
            `pl-dropdown-option-align-${props.align}`,
            {
                'pl-dropdown-option-disabled': props.disabled
            }
        ])

        return {
            render: () => (
                <div className={classes.value} onClick={onClick}>
                    {!!props.icon && <PlIcon icon={props.icon} className="pl-dropdown-option-icon"/>}
                    {slots.default(props.label)}
                </div>
            )
        }
    },
})

export default PlDropdownOption