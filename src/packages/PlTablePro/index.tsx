import {classnames, computed, designComponent, onBeforeUnmount, onMounted, PropType, SimpleFunction, watch} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import './table-pro.scss'
import {iTableProRenderConfig} from "../createUseTableOption/use/use.hooks";
import PlLoadingMask from "../PlLoadingMask";

export const PlTablePro = designComponent({
    name: 'pl-table-pro',
    props: {
        option: {type: Object as PropType<tTableOption>, required: true},
        loading: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        onMounted(() => {
            if (props.option.config.loadOnStart !== false) {
                props.option.pageMethods.reload()
            }
        })

        const loading = computed(() => {
            if (props.loading) {return true}
            return props.option.hooks.onLoading.exec(false)
        })

        const onRef = (el: HTMLDivElement) => {
            props.option.hooks.onRefTableProEl.exec(el)
        }

        let ejectSlotsDefaultHook: SimpleFunction | null = null
        watch(() => props.option, option => {
            if (!!ejectSlotsDefaultHook) {ejectSlotsDefaultHook()}
            ejectSlotsDefaultHook = option.hooks.onColumns.use(prev => <>
                {prev}
                {slots.default()}
            </> as any)
        }, {immediate: true})
        onBeforeUnmount(() => !!ejectSlotsDefaultHook && ejectSlotsDefaultHook())

        return () => {

            let tableProRenderConfigs: iTableProRenderConfig[] = []
            tableProRenderConfigs = props.option.hooks.onTableRender.exec(tableProRenderConfigs).sort((a, b) => a.seq - b.seq)

            return (
                <div className={classnames([
                    'pl-table-pro',
                    {'pl-table-pro-fill': props.option.config.fill},
                ])} ref={onRef}>
                    <div className="pl-table-pro-head">
                        {/*<span className="pl-table-pro-title">
                        <PlIcon icon="el-icon-menu" status="primary"/>
                        <span>{props.option.config.title}</span>
                    </span>*/}
                        {props.option.filter.searchFilter.render()}
                        <span/>
                        <div className="pl-table-pro-operation">
                            {props.option.hooks.onButtons.exec(undefined)}
                        </div>
                    </div>
                    {tableProRenderConfigs.map((i, index) => (
                        <React.Fragment key={index}>
                            {i.render()}
                        </React.Fragment>
                    ))}
                    <PlLoadingMask modelValue={loading.value} message="加载数据中..."/>
                </div>
            )
        }
    },
})

export default PlTablePro
