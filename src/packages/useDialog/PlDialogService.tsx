import {computed, useRefs, reactive, ref} from "plain-design-composition";
import {createDefaultService} from "../PlRoot/createDefaultService";
import {DialogServiceEditType, DialogServiceFormatOption} from "./index";
import {PlInput} from "../PlInput";
import {PlDialog} from "../PlDialog";
import {delay} from "plain-utils/utils/delay";
import React, {ReactNode} from "react";
import {STATUS} from "../../utils/constant";
import PlIcon from "../PlIcon";
import {StyleShape} from "../../use/useStyle";
import PlNumber from "../PlNumber";
import $$message from "../$$message";
import {deepcopy} from "plain-utils/object/deepcopy";

/**
 * 用来区分 DialogServiceOption中的选项与pl-dialog组件的属性
 * @author  韦胜健
 * @date    2020/11/7 20:04
 */
const OptionKeys = [
    'title',
    'message',
    'editRequired',
    'editType',
    'editValue',
    'editReadonly',
    'status',
    'render',
    'onConfirm',
    'onCancel',
    'close',
]

export default createDefaultService({
    name: 'pl-dialog-service',
    setup(option: DialogServiceFormatOption) {
        const {refs, onRef} = useRefs({
            input: PlInput,
            number: PlNumber,
        })

        const isShow = ref(false)

        const state = reactive({
            key: 0,
            option,
            editValue: null as any,
        })

        const targetOption = computed(() => {
            let option = {} as DialogServiceFormatOption
            let dialogProps = deepcopy(state.option.dialogProps || {})

            Object.keys(state.option).forEach((key) => {
                if (OptionKeys.indexOf(key) > -1) {
                    (option as any)[key] = (state.option as any)[key]
                } else {
                    (dialogProps as any)[key] = (state.option as any)[key]
                }
            })
            option.dialogProps = dialogProps

            return {
                option,
            }
        })

        const handler = {
            confirm: () => {
                const {onConfirm, editType, editReadonly, editRequired} = targetOption.value.option
                if (!onConfirm) {
                    isShow.value = false
                    return
                }
                if (!editType || editReadonly) {
                    isShow.value = false
                    return onConfirm(state.editValue)
                }
                const {editValue} = state
                if (editType !== "number") {
                    if (editRequired && (!editValue || !editValue.trim())) {
                        return $$message.error('请输入文本！')
                    } else {
                        isShow.value = false
                        return onConfirm(editValue.trim())
                    }
                } else {
                    if (editRequired && isNaN(Number(editValue))) {
                        return $$message.error('请输入数字！')
                    } else {
                        isShow.value = false
                        return onConfirm(editValue == null ? null : Number(editValue) as any)
                    }
                }
            },
            cancel: () => {
                if (!!targetOption.value.option.onCancel) {
                    targetOption.value.option.onCancel()
                }
                isShow.value = false
            },
        }

        async function service(option: DialogServiceFormatOption) {
            option.close = hide
            state.option = option
            state.key++
            isShow.value = true
            if (!!option.editType) {
                state.editValue = option.editValue as string
                await delay(300);
                if (option.editType === 'number') {
                    refs.number!.focus()
                } else {
                    refs.input!.methods.focus()
                }
            }
            return hide
        }

        function hide() {
            isShow.value = false
        }

        return {
            refer: {
                service,
                hide,
                isShow,
                isOpen: isShow,
            },
            render: () => {
                let {option} = targetOption.value
                let binding = option.dialogProps
                let status = option.status
                let serviceClass = 'pl-dialog-service';

                if (!!status) {
                    serviceClass += ` pl-dialog-service-status-${status}`
                }

                /*---------------------------------------head-------------------------------------------*/
                let head = <div className="pl-dialog-service-head">
                    {!!status && STATUS[status] && <PlIcon className="pl-dialog-service-status-icon" icon={STATUS[status].icon}/>}
                    {!!option.renderHead ? option.renderHead() : (option.title || '提示')}
                </div>
                /*---------------------------------------content-------------------------------------------*/
                let content: ReactNode;
                binding = {...binding}
                if (!!option.editType) {
                    if (option.editType === 'textarea') {
                        (binding as any).height = binding.height || '300px';
                        (binding as any).width = binding.width || '400px';
                    } else {
                        (binding as any).minHeight = null
                    }
                    serviceClass += ` pl-dialog-service-edit`
                    content = option.editType === 'number' ? (
                        <PlNumber
                            ref={onRef.number}
                            block
                            minHeight={null as any}
                            maxHeight={null as any}
                            v-model={state.editValue}
                            readonly={option.editReadonly}
                        />
                    ) : <PlInput
                        ref={(refer) => { onRef.input(refer) }}
                        block
                        minHeight={null as any}
                        maxHeight={null as any}
                        autoHeight={false}
                        v-model={state.editValue}
                        readonly={option.editReadonly}
                        textarea={option.editType === 'textarea'}/>
                } else if (!!option.message) {
                    (binding as any).minHeight = '80px'
                    content = (
                        <div className="pl-dialog-service-item-message">
                            {option.message}
                        </div>
                    )
                } else if (!!option.render) {
                    content = option.render()
                }
                /*---------------------------------------foot-------------------------------------------*/
                let foot = !option.renderFoot ? null : option.renderFoot()

                const width = (() => {
                    if (!!option.dialogProps && option.dialogProps.width !== undefined) {return option.dialogProps.width}
                    if (option.editType === DialogServiceEditType.textarea) {
                        return ((option.dialogProps || {}).width || '500px')
                    } else {
                        return 500
                    }
                })()

                return (
                    <PlDialog
                        serviceClass={serviceClass}
                        v-model={isShow.value}
                        key={state.key}

                        onConfirm={handler.confirm}
                        onCancel={handler.cancel}
                        closeOnConfirm={false}
                        closeOnCancel={false}

                        {...binding}
                        width={width}
                        shape={binding.shape || StyleShape.square}
                    >
                        {{
                            default: content,
                            head,
                            foot,
                        }}
                    </PlDialog>
                )
            }
        }
    },
})
