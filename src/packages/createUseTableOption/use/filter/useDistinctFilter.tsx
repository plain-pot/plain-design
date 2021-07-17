import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import useTableOption from "../../../useTableOption";
import React from "react";
import {iTableProConfig, PlainObject} from "../../createUseTableOption.utils";
import {designPage, useRefs} from "plain-design-composition";
import PlTablePro from "../../../PlTablePro";
import useDialog, {DialogServiceFormatOption} from "../../../useDialog";
import {Plc} from "../../../Plc";
import {renderBodyCell, renderHeadCell} from "../../../PlTable/plc/utils/render";
import {defer} from "../../../../utils/defer";
import PlcCheckRow from "../../../PlcCheckRow";

export type tFilterDistinctValue = string | number

export function useDistinctFilter() {

    const $dialog = useDialog()

    const {refs, onRef} = useRefs({check: PlcCheckRow})

    const state = {
        selected: [] as PlainObject[] | undefined
    }

    const pick = async ({plc, customConfig}: { plc: tPlc, customConfig: iTableProConfig }): Promise<tFilterDistinctValue[]> => {

        const dfd = defer<tFilterDistinctValue[]>()

        const Content = designPage(() => {
            const tableOption = useTableOption({
                ...customConfig,
                keyField: plc.props.field,
                enable: false,
                buttons: [],
                queryParams: {
                    distinctFields: [plc.props.field]
                },
            })

            return () => <>
                <PlTablePro option={tableOption}>
                    <PlcCheckRow toggleOnClickRow ref={onRef.check} selected={state.selected}/>
                    <Plc
                        title={plc.props.title}
                        field={plc.props.field}
                        filterName={plc.props.filterName}
                        filterHandler={plc.props.filterHandler}
                        filterConfig={plc.props.filterConfig}
                    >
                        {{
                            head: () => renderHeadCell(plc),
                            normal: scope => renderBodyCell({node: scope.node, plc, formEdit: false}).body,
                        }}
                    </Plc>
                </PlTablePro>
            </>
        })

        const dlgOpt: Partial<DialogServiceFormatOption> = {
            title: plc.props.title,
            status: null,
            render: () => <Content/>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            confirmButton: true,
            cancelButton: true,
            onConfirm: () => {
                const checked = refs.check?.getSelected()
                state.selected = checked
                const distinctValues = !checked ? [] : checked.map((i) => i[plc.props.field!])
                onRef.check(null)
                dlgOpt.close!()
                dfd.resolve(distinctValues)
            },
            onCancel: async () => {
                onRef.check(null)
                dlgOpt.close!()
                dfd.reject('cancel')
            },
        }

        $dialog(dlgOpt)

        return dfd.promise
    }

    return {
        pick,
    }
}