import {designComponent, useRefs} from "plain-design-composition";
import React from "react";
import useClass from "plain-design-composition/src/use/useClasses";
import PlIcon from "../PlIcon";

export const PlDropdownGroup = designComponent({
    name: 'pl-dropdown-group',
    slots: ['default', 'title'],
    inheritPropsType: HTMLDivElement,
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const classes = useClass(() => [
            'pl-dropdown-group',
            {'pl-dropdown-no-title': !slots.title.isExist()}
        ])

        return {
            refer: {
                refs,
            },
            render: () => (
                <div className={classes.value} ref={onRef.el}>
                    {slots.title.isExist() && (
                        <div className="pl-dropdown-group-title">
                            <PlIcon icon="el-icon-list"/>
                            <span>{slots.title()}</span>
                        </div>
                    )}
                    <div className="pl-dropdown-group-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})

export default PlDropdownGroup