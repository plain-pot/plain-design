import React from "react";
import PlButton from "../../PlButton";
import PlDropdownOption from "../../PlDropdownOption";
import {tTableOptionMethods} from "./use.methods";
import {eTableProEditType} from "../createUseTableOption.utils";
import {toArray} from "../../../utils/toArray";
import {tTableOptionHooks} from "./use.hooks";
import {tTableOptionCommand} from "./use.command";
import {tTableOptionSetting} from "./setting/use.setting";
import {eTableOptionSettingView} from "./setting/TableOptionSetting";

export interface iTableOptionButton {
    label: string | (() => string),
    icon?: string | (() => string),
    handler: (...args: any[]) => void,
    show?: boolean | (() => boolean),
    disabled?: boolean | (() => boolean),
    command?: string | string[],
}

export function useTableOptionButtons({hooks, methods, command, setting}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, command: tTableOptionCommand, setting: tTableOptionSetting }) {

    function format(btn: iTableOptionButton) {
        const label = typeof btn.label === "string" ? btn.label : btn.label()
        const icon = btn.icon == null ? null : (typeof btn.icon === "string" ? btn.icon : btn.icon())
        const show = btn.show == null ? true : (typeof btn.show === "boolean" ? btn.show : btn.show())
        const disabled = btn.disabled == null ? undefined : (typeof btn.disabled === "boolean" ? btn.disabled : btn.disabled())
        return {
            ...btn,
            label,
            icon,
            show,
            disabled
        }
    }

    const registry = (btn: iTableOptionButton) => {

        if (!!btn.command) {
            toArray(btn.command).forEach(name => command.on(name, () => btn.handler()))
        }

        return {
            button: () => {
                const {show, label, disabled, icon} = format(btn)
                return !show ? null : (
                    <PlButton
                        label={label}
                        icon={icon || undefined}
                        disabled={disabled}
                        onClick={btn.handler}
                    />
                )
            },
            dropdown: () => {
                const {show, label, disabled, icon} = format(btn)
                return !show ? null : (
                    <PlDropdownOption
                        label={label + (!btn.command ? '' : `（${toArray(btn.command!).map(i => i.toUpperCase()).join(',')}）`)}
                        icon={icon || undefined}
                        disabled={disabled}
                        onClick={btn.handler}
                    />
                )
            },
        }
    }

    const btns = {
        insert: registry({label: '新建', icon: 'el-icon-document-add', handler: () => methods.editMethods.insert(),}),
        copy: registry({label: '复制', icon: 'el-icon-document-copy', handler: () => methods.editMethods.copy()}),
        delete: registry({label: '删除', icon: 'el-icon-document-remove', handler: () => methods.editMethods.delete()}),
        editForm: registry({label: '表单编辑', icon: 'el-icon-document', handler: () => methods.editMethods.update(undefined, eTableProEditType.form), command: 'alt+e'}),
        batchInsert: registry({label: '批量新建', icon: 'el-icon-document-add', handler: () => methods.editMethods.batchInsert(), command: 'alt+i'}),
        batchUpdate: registry({label: '批量编辑', icon: 'el-icon-edit-outline', handler: () => methods.editMethods.batchUpdate(), command: 'alt+u'}),
        batchDelete: registry({label: '批量删除', icon: 'el-icon-document-remove', handler: () => methods.editMethods.batchDelete(), command: 'alt+d'}),
        batchModify: registry({label: '批量修改', icon: 'el-icon-edit', handler: () => methods.editMethods.batchModify(), command: 'alt+m'}),
        seniorFilter: registry({label: '高级筛选', icon: 'el-icon-brush', handler: () => {setting.openSetting(eTableOptionSettingView.filter)}, command: 'alt+f'}),
        seniorSort: registry({label: '高级排序', icon: 'el-icon-sort', handler: () => {setting.openSetting(eTableOptionSettingView.sort)}, command: 'alt+g'}),
        setting: registry({label: '个性设置', icon: 'el-icon-setting', handler: () => {setting.openSetting(eTableOptionSettingView.config)}, command: 'alt+r'}),
        importData: registry({label: '导入数据', icon: 'el-icon-download', handler: () => {setting.openSetting(eTableOptionSettingView.import)}, command: 'alt+j'}),
        exportData: registry({label: '导出数据', icon: 'el-icon-upload1', handler: () => {setting.openSetting(eTableOptionSettingView.export)}, command: 'alt+k'}),
    }

    command.on('esc', () => methods.editMethods.cancel())
    command.on('alt+s', () => methods.editMethods.save())


    return {
        registry,
        btns,
    }
}

export type TabelOptionButtons = ReturnType<typeof useTableOptionButtons>