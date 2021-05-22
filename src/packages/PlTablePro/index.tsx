import {designComponent, onMounted, PropType} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import PlTable from "../PlTable";
import './table-pro.scss'
import Plc from "../Plc";
import PlButton from "../PlButton";

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
                <div className="pl-table-pro-head">
                    <span className="pl-table-pro-title">{props.option.config.title}</span>
                    <div className="pl-table-pro-operation">
                        <PlButton label={'新建'} mode="text" icon="el-icon-document-add"/>
                        <PlButton label={'复制'} mode="text" icon="el-icon-document-copy"/>
                        <PlButton label={'删除'} mode="text" icon="el-icon-document-remove"/>
                    </div>
                </div>
                <PlTable data={props.option.state.list}>
                    <Plc.PlcIndex start={props.option.pagination.pageState.page * props.option.pagination.pageState.size}/>
                    {slots.default()}
                </PlTable>
                {props.option.pagination.render()}
            </div>
        )
    },
})

export default PlTablePro