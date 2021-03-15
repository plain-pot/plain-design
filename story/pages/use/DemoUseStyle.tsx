import {designComponent} from 'plain-design-composition'
import './DemoUseStyle.scss'
import {DEFAULT_STATUS, StyleProps, StyleStatus, useStyle} from "../../../src/use/useStyle";
import React from 'react';
import useClass from "plain-design-composition/src/use/useClasses";

const DemoUseStyleParent = designComponent({
    props: {
        ...StyleProps,
    },
    slots: ['default'],
    setup({slots}) {

        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const classes = useClass(() => [
            'pl-use-style-parent',
            `pl-use-style-parent-status-${styleComputed.value.status}`
        ])

        return {
            render: () => (
                <div className={classes.value}>
                    <div>PARENT</div>
                    <div>
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})

const DemoUseStyleChild = designComponent({
    props: {
        ...StyleProps,
    },
    setup() {

        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const classes = useClass(() => [
            'pl-use-style-child',
            `pl-use-style-child-status-${styleComputed.value.status}`
        ])

        return {
            render: () => (
                <div className={classes.value}>
                    CHILD
                </div>
            )
        }
    },
})

export default designComponent({
    setup() {
        return () => <>
            <DemoUseStyleParent>
                <DemoUseStyleChild/>
                <DemoUseStyleChild/>
                <DemoUseStyleChild/>
            </DemoUseStyleParent>

            <DemoUseStyleParent status={StyleStatus.error}>
                <DemoUseStyleChild/>
                <DemoUseStyleChild/>
                <DemoUseStyleChild/>
            </DemoUseStyleParent>

            <DemoUseStyleParent>
                <DemoUseStyleChild status="error"/>
                <DemoUseStyleChild/>
                <DemoUseStyleChild/>
            </DemoUseStyleParent>

            <DemoUseStyleParent status="warn">
                <DemoUseStyleChild status="success"/>
                <DemoUseStyleChild/>
                <DemoUseStyleChild/>
            </DemoUseStyleParent>

        </>
    },
})