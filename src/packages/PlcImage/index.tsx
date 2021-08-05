import {designComponent} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions, PlcPropsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlObjectPropsOption} from "../PlObject";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import React from "react";
import PlImage from "../PlImage";
import {injectPlainTable} from "../PlTable";
import PlImageUploader from "../PlImageUploader";

export const PlcImage = designComponent({
    props: {
        ...PlcPropsOptions,
        ...PlObjectPropsOption,
        ...createPlcPropOptions({
            align: 'center',
            noPadding: true,
        }),
        imgKeyField: {type: String},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {

        const table = injectPlainTable()
        const bodyRowHeight = table.props.bodyRowHeight
        const size = Math.ceil((bodyRowHeight as number) - 20)

        const uploadConfig = {
            action: 'http://localhost:7001/saveFile',
            filename: 'file',
            data: {},
        }

        return useExternalPlc({
            props,
            slots,
            scopeSlots,
            event,
            defaultScopeSlots: {
                normal: ({row, plc}) => (
                    !plc.props.field ? null : <PlImage src={row[plc.props.field]} height={size} width={size} fit="contain"/>
                ),
                edit: ({row, plc}) => !plc.props.field ? null :
                    <PlImageUploader
                        v-model={row[plc.props.field]}
                        uploadConfig={uploadConfig}
                        height={size}
                        width={size}
                        handleDelete={() => {
                            row[plc.props.field!] = null
                            row[props.imgKeyField!] = null
                        }}
                        onUploadSuccess={(resp: any) => {
                            row[props.imgKeyField!] = resp.data.id
                        }}
                    />
            }
        })
    },
})

export default PlcImage