import {computed, designComponent, onMounted, reactive, useRefs, watch} from "plain-design-composition";
import React from "react";
import {PlcGroup} from "../../PlcGroup";
import {StyleShape, StyleSize, useStyle} from "../../../use/useStyle";
import {useTableHooks} from "./use/useTableHooks";
import {usePlcData} from "./use/usePlcData/usePlcData";
import {TableDefaultRowHeight, TableProps} from "./utils/table.utils";
import {removeUnit} from "plain-utils/string/removeUnit";

export default designComponent({
    name: 'pl-table',
    props: TableProps,
    provideRefer: true,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({
            group: PlcGroup,
            el: HTMLDivElement,
        })
        const hooks = useTableHooks()
        const {plcData} = usePlcData({hooks})

        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape as any || StyleShape.square
                config.size = props.size as any || StyleSize.normal
                config.status = props.status as any
            }
        })

        const {numberState} = (() => {
            const watchValue = computed(() => {
                const {bodyRowHeight: propsBodyRowHeight, headRowHeight: propsHeadRowHeight,} = props
                let {size} = styleComputed.value
                if (!size) {size = StyleSize.normal}
                const bodyRowHeight = Number(propsBodyRowHeight == null ? removeUnit(TableDefaultRowHeight.body[size]) : propsBodyRowHeight)
                const headRowHeight = Number(propsHeadRowHeight == null ? removeUnit(TableDefaultRowHeight.head[size]) : propsHeadRowHeight)
                return {bodyRowHeight, headRowHeight}
            })
            const numberState = reactive({...watchValue.value,})
            watch(watchValue, () => Object.assign(numberState, watchValue.value))
            return {numberState}
        })();

        onMounted(() => {
            hooks.onTableMounted.exec(refs.el!)
        })
        watch(() => !!refs.group ? refs.group.children : null, val => {
            hooks.onCollectPlc.exec(val || [])
        })

        const refer = {
            hooks,
            numberState,
        }

        return {
            refer,
            render: () => (
                <div className="pl-table" ref={onRef.el}>
                    <PlcGroup ref={onRef.group}>{slots.default()}</PlcGroup>
                </div>
            )
        }
    },
})