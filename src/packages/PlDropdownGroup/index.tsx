import {designComponent} from "plain-design-composition";
import React from "react";
import useClass from "plain-design-composition/src/use/useClasses";
import PlIcon from "../PlIcon";

export const PlDropdownGroup = designComponent({
    name: 'pl-dropdown-group',
    slots: ['default', 'title'],
    setup({props, slots}) {

        const classes = useClass(() => [
            'pl-dropdown-group',
            {'pl-dropdown-no-title': !slots.title.isExist()}
        ])

        return {
            render: () => (
                <div className={classes.value}>
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