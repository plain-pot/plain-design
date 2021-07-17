import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import useTableOption from "../../../useTableOption";
import React from "react";
import {iTableProConfig} from "../../createUseTableOption.utils";
import {designPage, onMounted, useRefs} from "plain-design-composition";
import PlTablePro from "../../../PlTablePro";
import {PlcCheck} from "../../../PlcCheck";
import useDialog, {DialogServiceFormatOption} from "../../../useDialog";
import {Plc} from "../../../Plc";
import {renderBodyCell, renderHeadCell} from "../../../PlTable/plc/utils/render";
import useMessage from "../../../useMessage";
import {defer} from "../../../../utils/defer";

export type tFilterDistinctValue = string | number

export function useDistinctFilter() {

    const $dialog = useDialog()
    const $message = useMessage()

    const {refs, onRef} = useRefs({check: PlcCheck})

    const pick = async ({plc, customConfig, selectValues}: { plc: tPlc, customConfig: iTableProConfig, selectValues?: tFilterDistinctValue[] }): Promise<tFilterDistinctValue[]> => {

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

            let eject = tableOption.hooks.onLoaded.use(() => {
                eject()
                !!selectValues && refs.check!.addSelected(selectValues)
            })

            return () => <>
                <PlTablePro option={tableOption}>
                    <PlcCheck toggleOnClickRow ref={onRef.check}/>
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
                const distinctValues = !checked ? [] : checked.map((i) => i.data[plc.props.field!])
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