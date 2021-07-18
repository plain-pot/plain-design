import {classnames, designComponent, PropType, reactive} from "plain-design-composition";
import React from "react";
import './TableOptionSetting.scss'
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {deepcopy} from "plain-utils/object/deepcopy";
import {TableOptionSettingSort} from "./sort/TableOptionSettingSort";
import {tTableOptionSort} from "../use.option.sort";

export enum eTableOptionSettingView {
    filter = 'filter',
    sort = 'sort',
    config = 'config',
    import = 'import',
    export = 'export',
}

export default designComponent({
    props: {
        initView: {type: String as PropType<eTableOptionSettingView>, required: true},
        getConfig: {type: Function as PropType<() => { plcList: tPlc[], tableSort: tTableOptionSort }>, required: true},
    },
    setup({props}) {

        const state = reactive({
            view: props.initView,

            /*排序临时数据，避免在apply应用之前，因为切换面板导致数据丢失*/
            sortData: deepcopy(props.getConfig().tableSort.sortStateData.value),
        })

        const renderer = [
            {},
            {
                title: '高级筛选',
                view: eTableOptionSettingView.filter,
                render: () => {
                    return '==>>高级筛选'
                },
            },
            {
                title: '高级排序',
                view: eTableOptionSettingView.sort,
                render: () => {
                    return <TableOptionSettingSort v-model={state.sortData} getConfig={props.getConfig}/>
                },
            },
            {
                title: '个性设置',
                view: eTableOptionSettingView.config,
                render: () => {
                    return '==>> 个性设置'
                },
            },
            {
                title: '导入数据',
                view: eTableOptionSettingView.import,
                render: () => {
                    return '==>> 导入数据'
                },
            },
            {
                title: '导出数据',
                view: eTableOptionSettingView.export,
                render: () => {
                    return '==>> 导出数据'
                },
            },
            {},
        ]


        return () => (
            <div className="pl-table-pro-setting">
                <div className="pl-table-pro-setting-nav">
                    {renderer.map((item, index) => (
                        <div className={classnames([
                            'pl-table-pro-setting-nav-item',
                            {
                                'pl-table-pro-setting-nav-item-active': item.view === state.view,
                                'pl-table-pro-setting-nav-item-prev': !!renderer[index + 1] && renderer[index + 1].view === state.view,
                                'pl-table-pro-setting-nav-item-next': !!renderer[index - 1] && renderer[index - 1].view === state.view,
                            }
                        ])} key={index} onClick={() => !!item.view && (state.view = item.view!)}>
                            <div className="pl-table-pro-setting-nav-item-inner">
                                {item.title}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pl-table-pro-setting-content">
                    {(() => {
                        const r = renderer.find(i => i.view === state.view)
                        return !!r && !!r.render && r.render()
                    })()}
                </div>
            </div>
        )
    },
})