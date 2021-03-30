import {designComponent, useRefs} from "plain-design-composition";
import {TableHoverPart, TableProps} from "./core/table.utils";
import {useTree} from "../PlTree/core/useTree";
import {TableNode} from "./core/useTableNode";
import {PlainScroll} from "../PlScroll";
import React from "react";
import {StyleShape, StyleSize, useStyle} from "../../use/useStyle";

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

        const {refs, onRef} = useRefs({el: HTMLDivElement,})
        const {styleComputed} = useStyle({
            adjust: config => {
                config.shape = props.shape as any || StyleShape.square
                config.size = props.size as any || StyleSize.normal
                config.status = props.status as any
            }
        })
        const {emit} = event

        return {
            refer: {},
            render: () => {
                return (
                    <div>
                        this is table
                    </div>
                )
            }
        }
    },
})

export default PlTable