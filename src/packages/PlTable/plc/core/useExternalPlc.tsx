import {ExtractPropTypes} from "plain-design-composition";
import {PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions, tPlcScopeSlots} from "../utils/plc.scope-slots";
import {TableRenderScope, tPlcEvent, tPlcType} from "../utils/plc.type";
import {useBasePlc} from "./useBasePlc";

type tPlcDefaultScopeSlotsOptions = Partial<typeof PlcScopeSlotsOptions>

export function useExternalPlc({props, scopeSlots, event, defaultScopeSlots}: {
    event: tPlcEvent,
    props: ExtractPropTypes<typeof PlcPropsOptions>,
    scopeSlots: tPlcScopeSlots,
    defaultScopeSlots?: tPlcDefaultScopeSlotsOptions,
}) {

    const formatScopeSlots: tPlcScopeSlots = {
        ...scopeSlots,
        head: Object.assign((scope: { plc: tPlcType }) => {
            if (scopeSlots.head.isExist()) {
                return scopeSlots.head(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.head) {
                return defaultScopeSlots.head(scope)
            }
            return scope.plc.props.title
        }, {
            isExist: () => {
                if (scopeSlots.head.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.head) {
                    return true
                }
                return false
            },
        }),
        normal: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.normal.isExist()) {
                return scopeSlots.normal(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.normal) {
                return defaultScopeSlots.normal(scope)
            }
            return !scope.plc.props.field ? '' : scope.row[scope.plc.props.field]
        }, {
            isExist: () => {
                if (scopeSlots.normal.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.normal) {
                    return true
                }
                return false
            },
        }),
        edit: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.edit.isExist()) {
                return scopeSlots.edit(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.edit) {
                return defaultScopeSlots.edit(scope)
            }
            return formatScopeSlots.normal(scope)
        }, {
            isExist: () => {
                if (scopeSlots.edit.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.edit) {
                    return true
                }
                return false
            },
        }),
        summary: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.summary.isExist()) {
                return scopeSlots.summary(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.summary) {
                return defaultScopeSlots.summary(scope)
            }
            return formatScopeSlots.normal(scope)
        }, {
            isExist: () => {
                if (scopeSlots.summary.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.summary) {
                    return true
                }
                return false
            },
        }),
    }

    const {render, refer} = useBasePlc({
        props, event,
        scopeSlots: formatScopeSlots,
    })

    return {render, refer}
}