import React from "react";
import PlButton from "../../PlButton";
import PlDropdownOption from "../../PlDropdownOption";
import {tTableMethods} from "./use.methods";
import {eTableProEditType} from "../createUseTableOption.utils";

export interface iTableOptionButton {
    label: string | (() => string),
    icon?: string | (() => string),
    handler: (...args: any[]) => void,
    show?: boolean | (() => boolean),
    disabled?: boolean | (() => boolean),
}

export function useTableOptionButtons({methods}: { methods: tTableMethods }) {

    const registry = (btn: iTableOptionButton) => {
        const label = () => typeof btn.label === "string" ? btn.label : btn.label()
        const icon = () => btn.icon == null ? null : (typeof btn.icon === "string" ? btn.icon : btn.icon())
        const show = () => btn.show == null ? true : (typeof btn.show === "boolean" ? btn.show : btn.show())
        const disabled = () => btn.disabled == null ? undefined : (typeof btn.disabled === "boolean" ? btn.disabled : btn.disabled())
        return {
            button: () => !show() ? null : (
                <PlButton
                    label={label()}
                    icon={icon() || undefined}
                    disabled={disabled()}
                    onClick={btn.handler}
                />
            ),
            dropdown: () => !show() ? null : (
                <PlDropdownOption
                    label={label()}
                    icon={icon() || undefined}
                    disabled={disabled()}
                    onClick={btn.handler}
                />
            ),
        }
    }

    const btns = {
        insert: registry({label: '新建', icon: 'el-icon-document-add', handler: () => methods.editMethods.insert(),}),
        copy: registry({label: '复制', icon: 'el-icon-document-copy', handler: () => methods.editMethods.copy()}),
        delete: registry({label: '删除', icon: 'el-icon-document-remove', handler: () => methods.editMethods.delete()}),
        editForm: registry({label: '表单编辑', icon: 'el-icon-document', handler: () => methods.editMethods.update(undefined, eTableProEditType.form)}),
        batchInsert: registry({label: '批量新建', icon: 'el-icon-document-add', handler: () => methods.editMethods.batchInsert()}),
        batchUpdate: registry({label: '批量编辑', icon: 'el-icon-edit-outline', handler: () => methods.editMethods.batchUpdate()}),
        batchDelete: registry({label: '批量删除', icon: 'el-icon-document-remove', handler: () => methods.editMethods.batchDelete()}),
        batchModify: registry({label: '批量修改', icon: 'el-icon-edit', handler: () => methods.editMethods.batchModify()}),
        seniorFilter: registry({label: '高级筛选', icon: 'el-icon-brush', handler: () => {},}),
        seniorSort: registry({label: '高级排序', icon: 'el-icon-sort', handler: () => {},}),
        setting: registry({label: '个性设置', icon: 'el-icon-setting', handler: () => {}}),
        importData: registry({label: '导入数据', icon: 'el-icon-download', handler: () => {}}),
        exportData: registry({label: '导出数据', icon: 'el-icon-upload1', handler: () => {}}),
    }

    return {
        registry,
        btns,
    }
}

export type TabelOptionButtons = ReturnType<typeof useTableOptionButtons>