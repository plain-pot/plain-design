import {designComponent, onMounted, PropType} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import PlTable from "../PlTable";
import './table-pro.scss'

export const PlTablePro = designComponent({
    props: {
        option: {type: Object as PropType<tTableOption>, required: true},
    },
    slots: ['default'],
    setup({props, slots}) {

        onMounted(() => {
            if (props.option.config.loadOnStart !== false) {
                props.option.methods.reload()
            }
        })

        return () => (
            <div className="pl-table-pro">
                <PlTable data={props.option.state.list}>
                    {slots.default()}
                </PlTable>
                {props.option.pagination.render()}
            </div>
        )
    },
})

export default PlTablePro