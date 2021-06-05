import useDialog from "../../useDialog";
import {computed, reactive, useRefs} from "plain-design-composition";
import PlForm from "../../PlForm";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {tFormPropRules} from "../../PlForm/form.validate";
import PlFormItem from "../../PlFormItem";
import {renderBodyCell} from "../../PlTable/plc/utils/render";
import React from "react";
import PlButton from "../../PlButton";
import PlButtonGroup from "../../PlButtonGroup";
import PlDropdown from "../../PlDropdown";
import PlIcon from "../../PlIcon";
import PlDropdownMenu from "../../PlDropdownMenu";
import PlDropdownOption from "../../PlDropdownOption";
import {eTableProEditType} from "../createUseTableOption.utils";

export function useTableOptionModifyForm() {

    const $dialog = useDialog()
    const {refs, onRef} = useRefs({form: PlForm})

    const modify = ({node, title, plcList, onConfirm, onCancel, rules}: {
        node: TableNode,
        title: string,
        plcList: tPlc[],
        onConfirm: (node: TableNode) => void,
        onCancel?: () => void,
        rules?: tFormPropRules,
    }) => {
        node.edit = true
        node.editRow = node.data
        plcList = plcList.filter(i => !i.props.hideInForm && !!i.props.field)
        const state = reactive({
            editPlcArr: [plcList[0]] as tPlc[],
            toBeAddPlc: plcList[1] as tPlc | undefined,
        })

        const addPlcList = computed(() => plcList.filter(i => i !== state.toBeAddPlc && state.editPlcArr.indexOf(i) === -1))

        const handler = {
            changeAddPlc: (e: React.MouseEvent, plc: tPlc) => {
                e.stopPropagation()
                state.toBeAddPlc = plc
            },
            addPlc: () => {
                !!state.toBeAddPlc && state.editPlcArr.push(state.toBeAddPlc)
                state.toBeAddPlc = addPlcList.value[0]
            },
            rmPlc: (index: number) => {
                state.editPlcArr.length > 1 && state.editPlcArr.splice(index, 1)
                state.toBeAddPlc = addPlcList.value[0]
            },
        }

        const dialog = $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                destroyOnClose: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                footAlign: 'flex-start',
            },
            title,
            render() {
                return (
                    <div>
                        <PlForm
                            ref={onRef.form}
                            column={1}
                            width={'100%'}
                            centerWhenSingleColumn={false}
                            modelValue={node.editRow}
                            rules={rules}
                            style={{overflow: 'hidden'}}
                        >
                            {state.editPlcArr.map((plc, index) => (
                                <PlFormItem
                                    key={index}
                                    label={plc.props.title}
                                    required={plc.props.required}
                                    rules={plc.props.rules}
                                    field={plc.props.field}>
                                    {{
                                        default: renderBodyCell({node, plc, formEdit: true}).body,
                                        suffix: <PlButton icon="el-icon-minus" mode="stroke" onClick={() => handler.rmPlc(index)}/>
                                    }}
                                </PlFormItem>
                            ))}
                            {addPlcList.value.length > 0 && <PlFormItem>
                                <PlButtonGroup>
                                    <PlDropdown placement="bottom-start" width={null as any}>
                                        {{
                                            reference: ({open}) => (
                                                <PlButton mode="stroke">
                                                    <span>{!!state.toBeAddPlc && state.toBeAddPlc.props.title}</span>
                                                    <PlIcon icon={'el-icon-arrow-down'} style={{
                                                        transition: 'transform 200ms linear',
                                                        transform: `rotateX(${open ? 180 : 0}deg)`,
                                                    }}/>
                                                </PlButton>
                                            ),
                                            popper: <PlDropdownMenu>
                                                {addPlcList.value.map((plc, index) => (
                                                    <PlDropdownOption label={plc.props.title} key={index} onClick={e => handler.changeAddPlc(e, plc)}/>
                                                ))}
                                            </PlDropdownMenu>
                                        }}
                                    </PlDropdown>

                                    <PlButton label={'新增编辑字段'} icon="el-icon-plus" onClick={handler.addPlc}/>
                                </PlButtonGroup>
                            </PlFormItem>}
                        </PlForm>
                    </div>
                )
            },
            onConfirm: async () => {
                await refs.form!.validate()
                dialog.close()
                onConfirm(node)
            },
            onCancel: () => {
                dialog.close()
                !!onCancel && onCancel()
            },
            confirmButton: true,
            cancelButton: true,
        })
    }

    return {modify}
}