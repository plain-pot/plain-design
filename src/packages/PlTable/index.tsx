import {computed, designComponent, inject, onMounted, PropType, useClasses} from "plain-design-composition";
import {TableHoverPart, TableProps} from "./table/utils/table.utils";
import {useTree} from "../PlTree/core/useTree";
import {TableNode, useTableNode} from "./core/useTableNode";
import {PlainScroll} from "../PlScroll";
import React from "react";
import {StyleShape, StyleSize, useStyle} from "../../use/useStyle";
import {PlcCollector} from "./plc/core/PlcCollector";
import {usePlcList} from "./plc/format/usePlcList";
import {useBindScroll} from "./core/useBindScroll";
import {useFixedShadow} from "./core/useFixedShadow";
import {hasClass} from "plain-utils/dom/hasClass";
import {PltHead} from "./core/head/head";
import {PltBody} from "./core/body/body";
import {PlLoadingMask} from "../PlLoadingMask";
import {getFormRuleData} from "../PlForm/form.validate";

export const PlTable = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps
    },
    provideRefer: true,
    emits: {
        ...useTree.createEvent<TableNode>(),
        onScrollLeft: (scrollLeft: number, part: TableHoverPart) => true,
        onVirtualMounted: (data: { scroll: PlainScroll }) => true,

        onClickRow: (node: TableNode, e: React.MouseEvent) => true,
        onDblclickRow: (node: TableNode, e: React.MouseEvent) => true,
        onClickCell: (node: TableNode, e: React.MouseEvent) => true,
        onDblclickCell: (node: TableNode, e: React.MouseEvent) => true,
    },
    slots: ['default'],
    setup({props, slots, event}) {

        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape as any || StyleShape.square
                config.size = props.size as any || StyleSize.normal
                config.status = props.status as any
            }
        })
        const {emit} = event
        const {numberState, plcData, refs, onRef} = usePlcList({props, styleComputed})
        const {bindScroll} = useBindScroll(event)
        const {state, flatNodes, summaryNodes, dataModel, methods, current, handler, utils} = useTableNode({props, emit, getValidate: () => formValidate.value})
        const {fixedShadowClass} = useFixedShadow(event)
        const formValidate = computed(() => getFormRuleData({
            // todo
            formProps: {rules: props.rules},
            formItems: {
                value: !plcData.value ? [] : plcData.value.flatPlcList.map(plc => ({
                    props: {
                        label: plc.props.title,
                        field: plc.props.field,
                        required: plc.props.required,
                        rules: plc.props.rules,
                    }
                }))
            },
            // todo
            requiredMessage: '必填',
        }))

        /*是否可以启用虚拟滚动*/
        const disabledVirtual = computed(() => props.virtual == false || (!!plcData.value && plcData.value.notFitVirtual.length > 0))

        const classes = useClasses(() => [
            'pl-table',
            `pl-table-size-${styleComputed.value.size}`,
            `pl-table-shape-${styleComputed.value.shape}`,
            {
                'pl-table-border': props.border,
                'pl-table-stripe': props.stripe,
            },
            ...fixedShadowClass.value,
        ])

        const exposeHandler = {
            ...handler,
            onClickRow: (e: React.MouseEvent, node: TableNode) => {
                methods.setCurrent(node.key);
                emit.onClickRow(node, e);
                hasClass(e.target as HTMLElement, 'plt-cell') && emit.onClickCell(node, e);
            },
            onDblclickRow: (e: React.MouseEvent, node: TableNode) => {
                emit.onDblclickRow(node, e)
                hasClass(e.target as HTMLElement, 'plt-cell') && emit.onDblclickCell(node, e);
            }
        }

        const refer = {
            refs,
            onRef,
            props,
            numberState,
            plcData,
            bindScroll,
            event,
            dataModel,
            state, flatNodes, summaryNodes,
            disabledVirtual,
            handler: exposeHandler,
            ...methods,
            formValidate,
            current,
            utils,
        }

        onMounted(() => {
            // console.log(refer.nodeState)
        })

        return {
            refer,
            render: () => (
                <div className={classes.value} ref={onRef.el}>
                    <PlcCollector ref={onRef.collector}>{slots.default()}</PlcCollector>
                    {!!plcData.value && <>
                        {!props.hideHeader && <PltHead table={refer}/>}
                        <PltBody table={refer}/>
                    </>}
                    <PlLoadingMask modelValue={props.loading || state.root.loading}/>
                </div>
            )
        }
    },
})

export default PlTable

export const PlainTable = Object as PropType<typeof PlTable.use.class>

export function injectPlainTable() {return inject('@@pl-table') as typeof PlTable.use.class}