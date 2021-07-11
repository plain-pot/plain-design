import {computed, designComponent, onBeforeUnmount, onMounted, PropType, SimpleFunction, watch} from "plain-design-composition";
import React from "react";
import {tTableOption} from "../createUseTableOption";
import './table-pro.scss'
import PlButton from "../PlButton";
import PlDropdown from "../PlDropdown";
import PlDropdownMenu from "../PlDropdownMenu";
import PlIcon from "../PlIcon";
import PlButtonGroup from "../PlButtonGroup";
import {iTableProRenderConfig} from "../createUseTableOption/use/use.hooks";

export const PlTablePro = designComponent({
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
                <div className="pl-table-pro">
                    <div className="pl-table-pro-head">
                        {/*<span className="pl-table-pro-title">
                        <PlIcon icon="el-icon-menu" status="primary"/>
                        <span>{props.option.config.title}</span>
                    </span>*/}
                        {props.option.filter.searchFilter.render()}
                        <div className="pl-table-pro-operation">
                            {props.option.hooks.onButtons.exec(
                                <PlButtonGroup>
                                    {props.option.buttons.btns.insert.button()}
                                    {props.option.buttons.btns.copy.button()}
                                    {props.option.buttons.btns.delete.button()}
                                    <PlDropdown placement="bottom-end" width="190" height={null as any}>
                                        {{
                                            reference: ({open}) => (
                                                <PlButton>
                                                    <span>更多</span>
                                                    <PlIcon icon={'el-icon-arrow-down'} style={{
                                                        transition: 'transform 200ms linear',
                                                        transform: `rotateX(${open ? 180 : 0}deg)`,
                                                    }}/>
                                                </PlButton>
                                            ),
                                            popper: <PlDropdownMenu>
                                                {props.option.buttons.btns.editForm.dropdown()}
                                                {props.option.buttons.btns.batchInsert.dropdown()}
                                                {props.option.buttons.btns.batchUpdate.dropdown()}
                                                {props.option.buttons.btns.batchDelete.dropdown()}
                                                {props.option.buttons.btns.batchModify.dropdown()}
                                                {props.option.buttons.btns.seniorFilter.dropdown()}
                                                {props.option.buttons.btns.seniorSort.dropdown()}
                                                {props.option.buttons.btns.setting.dropdown()}
                                                {props.option.buttons.btns.importData.dropdown()}
                                                {props.option.buttons.btns.exportData.dropdown()}
                                            </PlDropdownMenu>
                                        }}
                                    </PlDropdown>
                                </PlButtonGroup>
                            )}
                        </div>
                    </div>
                    {tableProRenderConfigs.map((i, index) => (
                        <React.Fragment key={index}>
                            {i.render()}
                        </React.Fragment>
                    ))}
                    {props.option.filter.formFilter.render()}
                    {props.option.pagination.render()}
                </div>
            )
        }
    },
})

export default PlTablePro
