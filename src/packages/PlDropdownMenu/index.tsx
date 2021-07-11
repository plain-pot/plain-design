import {designComponent} from "plain-design-composition";
import PlDropdown from "../PlDropdown";
import React from "react";

export const PlDropdownMenu = designComponent({
    name: 'pl-dropdown-menu',
    props: {},
    emits: {
        onClickOption: (e: React.MouseEvent, val: any) => true,
    },
    slots: ['default'],
    provideRefer: true,
    setup({props, slots, event: {emit}}) {

        const dropdown = PlDropdown.use.inject()

        const handler = {
            clickOption: (e: React.MouseEvent, val: any) => {
                emit.onClickOption(e, val)
                dropdown.handler.clickDropdownOption(e)
            }
        }

        return {
            refer: {
                handler,
            },
            render: slots.default
        }
    },
})

export default PlDropdownMenu