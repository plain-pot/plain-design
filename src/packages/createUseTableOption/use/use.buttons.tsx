import React from "react";
import PlButton from "../../PlButton";
import PlDropdownOption from "../../PlDropdownOption";
import {tTableOptionMethods} from "./use.methods";
import {eTableProEditType, iTableOptionButton, iTableOptionButtonInner, iTableOptionButtonOuter, tTableOptionConfig} from "../createUseTableOption.utils";
import {toArray} from "../../../utils/toArray";
import {tTableOptionHooks} from "./use.hooks";
import {tTableOptionCommand} from "./use.command";
import {tTableOptionSetting} from "./setting/use.setting";
import {eTableOptionSettingView} from "./setting/TableOptionSetting";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {tTableOptionPermit} from "./use.permit";
import {classnames, computed} from "plain-design-composition";
import {deepcopy} from "plain-utils/object/deepcopy";
import PlDropdown from "../../PlDropdown";
import PlIcon from "../../PlIcon";
import PlDropdownMenu from "../../PlDropdownMenu";
import {Plc} from "../../Plc";


const DefaultSeq = {
    insert: 5,
    update: 10,
    delete: 15,
    other: 20,
}

export function useTableOptionButtons({hooks, methods, command, setting, config, permit}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, command: tTableOptionCommand, setting: tTableOptionSetting, permit: tTableOptionPermit, config: tTableOptionConfig }) {

    const state = {selectNode: undefined as undefined | TableNode}
    hooks.onSelectChange.use(selectNode => state.selectNode = selectNode)

    const utils = {
        getSeq: (btn: iTableOptionButton) => btn.seq == null ? DefaultSeq[btn.type] : btn.seq,
        createButton: (btn: iTableOptionButton) => {
            if (btn.position === 'out' && !!btn.command) {
                toArray(btn.command).forEach(name => command.on(name, (e) => !!btn.handler && btn.handler(e)))
            }
            return btn
        },
    }

    const standardButtons = {
        /*外置新建*/
        insertOut: utils.createButton({
            label: '新建',
            icon: 'el-icon-document-add',
            position: 'out',
            code: 'insert',
            type: 'insert',
            handler: () => methods.editMethods.insert(),
            seq: 4,
        }),
        /*外置赋值*/
        copyOut: utils.createButton({
            label: '复制',
            icon: 'el-icon-document-copy',
            position: 'out',
            code: 'copy',
            type: 'insert',
            handler: () => methods.editMethods.copy(deepcopy(state.selectNode?.data)),
            seq: 3,
            // show: () => config.hideButton['copy'] === false || config.hideButton['copy-out'] === false,
        }),
        /*行内复制*/
        copyIn: utils.createButton({
            label: '复制',
            position: 'in',
            code: 'copy',
            type: 'insert',
            handler: (node) => methods.editMethods.copy(deepcopy(node.data)),
            // show: () => config.hideButton['copy'] === false || config.hideButton['copy-in'] === false,
        }),
        /*外置删除*/
        deleteOut: utils.createButton({
            label: "删除",
            icon: 'el-icon-document-remove',
            position: 'out',
            code: 'delete',
            type: 'delete',
            seq: 2,
            handler: () => methods.editMethods.delete(state.selectNode),
        }),
        /*行内删除*/
        deleteIn: utils.createButton({
            label: '删除',
            position: 'in',
            code: 'delete',
            type: 'delete',
            handler: (node) => methods.editMethods.delete(node),
        }),
        /*行内编辑*/
        editIn: utils.createButton({
            label: '编辑',
            position: 'in',
            code: 'update',
            type: 'update',
            handler: node => methods.editMethods.update(node)
        }),

        /*外置-表单编辑*/
        formEdit: utils.createButton({
            label: '表单编辑',
            icon: 'el-icon-document',
            type: 'update',
            code: 'update-form',
            position: 'out',
            command: 'alt+e',
            handler: () => methods.editMethods.update(undefined, eTableProEditType.form),
        }),
        /*外置-批量新建*/
        batchInsert: utils.createButton({
            label: '批量新建',
            icon: 'el-icon-document-add',
            type: 'insert',
            code: 'inset-batch',
            position: 'out',
            command: 'alt+i',
            handler: () => methods.editMethods.batchInsert(),
        }),
        /*外置-批量编辑*/
        batchUpdate: utils.createButton({
            label: '批量编辑',
            icon: 'el-icon-edit-outline',
            type: 'update',
            code: 'update-batch',
            position: 'out',
            command: 'alt+u',
            handler: () => methods.editMethods.batchUpdate(),
        }),
        /*外置-批量删除*/
        batchDelete: utils.createButton({
            label: '批量删除',
            icon: 'el-icon-document-remove',
            type: 'delete',
            code: 'delete-batch',
            position: 'out',
            command: 'alt+d',
            handler: () => methods.editMethods.batchDelete(),
        }),
        /*外置-批量修改*/
        batchModify: utils.createButton({
            label: '批量修改',
            icon: 'el-icon-edit',
            type: 'update',
            code: 'update-modify',
            position: 'out',
            command: 'alt+m',
            handler: () => methods.editMethods.batchModify(),
        }),
        seniorFilter: utils.createButton({
            label: '高级筛选',
            icon: 'el-icon-brush',
            type: 'other',
            code: 'senior-filter',
            position: 'out',
            command: 'alt+f',
            handler: () => {setting.openSetting(eTableOptionSettingView.filter)}
        }),
        seniorSort: utils.createButton({
            label: '高级排序',
            icon: 'el-icon-sort',
            type: 'other',
            code: 'senior-sort',
            position: 'out',
            command: 'alt+g',
            handler: () => {setting.openSetting(eTableOptionSettingView.sort)}
        }),
        setting: utils.createButton({
            label: '个性设置',
            icon: 'el-icon-setting',
            type: 'other',
            code: 'setting',
            position: 'out',
            command: 'alt+r',
            handler: () => {setting.openSetting(eTableOptionSettingView.config)}
        }),
        importData: utils.createButton({
            label: '导入数据',
            icon: 'el-icon-download',
            type: 'other',
            code: 'import',
            position: 'out',
            command: 'alt+j',
            handler: () => {setting.openSetting(eTableOptionSettingView.import)}
        }),
        exportData: utils.createButton({
            label: '导出数据',
            icon: 'el-icon-upload1',
            type: 'other',
            code: 'export',
            position: 'out',
            command: 'alt+k',
            handler: () => {setting.openSetting(eTableOptionSettingView.export)}
        }),
    }

    command.on('esc', () => methods.editMethods.cancel())
    command.on('alt+s', () => methods.editMethods.save())

    const outerButtons = computed(() => {
        return [...Object.values(standardButtons), ...config.buttons || []]
            .filter(i => i.position === 'out')
            .map(item => {
                const btn = item as iTableOptionButtonOuter
                const {code, type, position} = btn
                let label = typeof btn.label === "function" ? btn.label() : btn.label
                let icon = typeof btn.icon === "function" ? btn.icon() : btn.icon
                let show = typeof btn.show === "function" ? btn.show() : btn.show
                let disabled = typeof btn.disabled === "function" ? btn.disabled() : btn.disabled
                let seq = utils.getSeq(btn)

                if (show == null) {show = true}
                if (disabled == null) {disabled = false}

                if (config.hideButton[code] || config.hideButton[`${code}-${position}`]) {show = false}
                if (type !== 'other') {
                    if (!permit[type]) {
                        show = false
                    }
                }

                return {...btn, label, icon, show, disabled, seq,}
            })
            .filter(i => i.show)
            .sort((a, b) => utils.getSeq(a) - utils.getSeq(b))
    })

    hooks.onButtons.use((prev) => {
        const [_1, _2, _3, ...leftBtns] = outerButtons.value
        return <>
            {prev}
            {[_1, _2, _3].map(({render, icon, disabled, handler, seq, label}, index) => (
                !!render ? render() : <PlButton
                    key={index}
                    icon={icon}
                    disabled={disabled}
                    onClick={handler}
                    label={label}
                    style={{order: String(seq)}}
                />
            ))}
            {leftBtns.length > 0 && <>
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
                        popper: () => (
                            <PlDropdownMenu>
                                {leftBtns.map(({label, icon, disabled, handler, seq, command, render}, index) => (
                                    !!render ? render() : <PlDropdownOption
                                        key={index}
                                        label={label + (!command ? '' : `（${toArray(command!).map(i => i.toUpperCase()).join(',')}）`)}
                                        icon={icon || undefined}
                                        disabled={disabled}
                                        onClick={handler}
                                    />
                                ))}
                            </PlDropdownMenu>
                        )
                    }}
                </PlDropdown>
            </>}
        </>
    })

    const innerButtons = computed(() => [...Object.values(standardButtons), ...config.buttons || []]
        .filter(i => i.position === 'in') as iTableOptionButtonInner[]);

    /*渲染in buttons*/
    hooks.onColumns.use(content => {
        if (config.hideOperation || innerButtons.value.length === 0) {return content}
        const show = (() => {
            let btns = deepcopy(innerButtons.value)
            if (!permit.insert) {btns = btns.filter(btn => btn.type !== 'insert')}
            if (!permit.update) {btns = btns.filter(btn => btn.type !== 'update')}
            if (!permit.delete) {btns = btns.filter(btn => btn.type !== 'delete')}
            if (!!config.hideButton) {
                btns = btns.filter(({code, position}) => !config.hideButton[code] && !config.hideButton[`${code}-${position}`])
            }
            return btns.length > 0
        })()
        if (!show) {return content}
        return <>
            {content}
            <Plc key="operator" title="操作" field="operator">
                {{
                    normal: ({node}) => {
                        if (node.edit) {
                            return <>
                                <a onClick={methods.editMethods.cancel}>{'取消'}</a>
                                <a onClick={methods.editMethods.save}>{'保存'}</a>
                            </>
                        }

                        const buttons = innerButtons.value.map(btn => {
                            const {code, type, position} = btn
                            let label = typeof btn.label === "function" ? btn.label(node) : btn.label
                            let icon = typeof btn.icon === "function" ? btn.icon(node) : btn.icon
                            let show = typeof btn.show === "function" ? btn.show(node) : btn.show
                            let disabled = typeof btn.disabled === "function" ? btn.disabled(node) : btn.disabled
                            let seq = utils.getSeq(btn)
                            if (show == null) {show = true}
                            if (disabled == null) {disabled = false}
                            if (config.hideButton[code] || config.hideButton[`${code}-${position}`]) {show = false}
                            if (type !== 'other') {
                                if (!permit[type]) {
                                    show = false
                                }
                            }
                            return {...btn, label, icon, show, disabled, seq,}
                        }).filter(i => i.show)

                        let dropdownButtons: typeof buttons = []
                        const maxButtons = 4

                        if (buttons.length > maxButtons) {
                            dropdownButtons = buttons.splice(maxButtons - 1)
                        }

                        return <>
                            {buttons.map(({render, icon, disabled, handler, seq, label}, index) => (
                                !!render ? render(node) : <PlButton
                                    mode="text"
                                    disabled={disabled}
                                    key={index}
                                    label={label}
                                    icon={icon}
                                    onClick={e => {
                                        e.preventDefault()
                                        !disabled && !!handler && handler(node, e)
                                    }}
                                    style={{order: String(seq) as any}}
                                />
                            ))}
                            {dropdownButtons.length > 0 && (
                                <PlDropdown placement="bottom-end" height={null as any}>
                                    {{
                                        reference: ({open}) => (
                                            <PlButton mode="text">
                                                <span>更多</span>
                                                <PlIcon icon={'el-icon-arrow-down'} style={{
                                                    transition: 'transform 200ms linear',
                                                    transform: `rotateX(${open ? 180 : 0}deg)`,
                                                }}/>
                                            </PlButton>
                                        ),
                                        popper: () => (
                                            <PlDropdownMenu>
                                                {dropdownButtons.map(({label, icon, disabled, handler, seq, render}, index) => (
                                                    !!render ? render(node) : <PlDropdownOption
                                                        key={index}
                                                        label={label}
                                                        icon={icon || undefined}
                                                        disabled={disabled}
                                                        onClick={(e) => !!handler && handler(node, e)}
                                                    />
                                                ))}
                                            </PlDropdownMenu>
                                        )
                                    }}
                                </PlDropdown>
                            )}
                        </>
                    }
                }}
            </Plc>
        </>
    })

    /*双击编辑*/
    hooks.onDblClickCell.use((selectNode) => {!config.hideButton.update && permit.update && methods.editMethods.update(selectNode)})
}

export type TabelOptionButtons = ReturnType<typeof useTableOptionButtons>