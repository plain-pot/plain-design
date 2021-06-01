import {PlcProps} from "./plc.utils";
import {deepcopy} from "plain-utils/object/deepcopy";
import {VNodeChild} from "../../../../shims";
import {tPlc} from "./plc.type";
import {TableNode} from "../../core/useTableNode";
import {designComponent, ExtractPropTypes} from "plain-design-composition";
import {ComponentPropsOptions} from "plain-design-composition"
import {usePlc} from "./Plc";
import React from "react";

export function designPlc<_,
    ExternalProps extends Readonly<ComponentPropsOptions> = {},
    TargetProps = ExtractPropTypes<typeof PlcProps & ExternalProps>,
    ExternalRefer = {},
    >(
    {
        name,
        standardProps,
        externalProps,
        setup,
    }: {
        name: string,
        standardProps?: Partial<{ [k in keyof typeof PlcProps]: any }>,
        externalProps?: ExternalProps,
        setup?: (props: TargetProps) => ExternalRefer,
    },
    render?: {
        head?: (scope: { plc: tPlc, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        default?: (scope: { node: TableNode, plc: tPlc, row: any, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        summary?: (scope: { node: TableNode, plc: tPlc, row: any, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
        edit?: (scope: { node: TableNode, plc: tPlc, row: any, props: TargetProps, refer: ExternalRefer }) => VNodeChild,
    },
) {
    const OptionProps = deepcopy(PlcProps)

    Object.entries(OptionProps).map(([key, value]) => {
        if (!!standardProps && !!(standardProps as any)[key]) {
            Object.assign(value, (standardProps as any)[key])
        }
        if (!!(render as any)[key]) {
            (value as any).default = function (scope: any) {
                return (render as any)[key]({
                    ...scope,
                    refer: !scope.plc.externalRefer ? null : scope.plc.externalRefer(),
                    props: scope.plc.props
                })
            }
        }
    })

    return designComponent({
        name,
        props: {
            ...OptionProps,
            ...(externalProps!),
        },
        setup({props}) {
            const {render, refer: plcRefer} = usePlc(props)
            if (!!setup) {
                const externalRefer = setup(props as any)
                Object.assign(plcRefer, {externalRefer: () => externalRefer})
            }
            return {
                refer: {
                    ...plcRefer,
                    ...{} as ExternalRefer,
                },
                render,
            }
        },
    })
}
