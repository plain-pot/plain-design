import {tTableOptionHooks} from "./use.hooks";
import PlTable from "../../PlTable";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {tPlcType} from "../../PlTable/plc/utils/plc.type";
import React from "react";
import {PlcIndex} from "../../PlcIndex";
import {iTableOptionState, iTableSortData, tTableOptionConfig} from "../createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";

export function useTableOptionBaseTable(
    {
        config,
        tableState,
        hooks,
        pagination,
        sortData,
    }: {
        config: tTableOptionConfig,
        tableState: iTableOptionState,
        hooks: tTableOptionHooks,
        pagination: tTablePagination,
        sortData: { value: iTableSortData[] },
    }) {
    const refTable = (table: typeof PlTable.use.class | null | undefined) => {
        hooks.onRefTable.exec(table!)
    }
    const handler = {
        onClickCell: (node: TableNode) => {hooks.onClickCell.exec(node)},
        onDblClickCell: (node: TableNode) => {hooks.onDblClickCell.exec(node)},
        onClickHead: (plc: tPlcType, e: React.MouseEvent) => hooks.onClickHead.exec({plc, e})
    }

    hooks.onTableRender.use(prev => [
        ...prev,
        {
            seq: 10,
            render: () => (
                <PlTable
                    ref={refTable}
                    data={tableState.list}
                    defaultEditingWhenAddRow={tableState.editingWhenAddRow}
                    currentKey={tableState.currentKey || undefined}
                    onUpdateCurrentKey={val => tableState.currentKey = val || null}
                    keyField={config.keyField}
                    onClickRow={handler.onClickCell}
                    onDblclickCell={handler.onDblClickCell}
                    onClickHead={handler.onClickHead}
                    sort={sortData.value}
                    onCollectPlcData={hooks.onCollectPlcData.exec}
                >
                    <PlcIndex start={pagination.pageState.page * pagination.pageState.size}/>
                    {hooks.onColumns.exec([])}
                </PlTable>
            )
        }
    ])
}