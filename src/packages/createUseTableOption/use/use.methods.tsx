import {TableMode, iTableProDefaultConfig, iTableState, tTableOptionConfig, tUrlConfig, eTableProEditType} from "../createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableOptionHooks} from "./use.hooks";
import $$notice from "../../$$notice";
import {nextTick} from "../../../utils/nextTick";
import PlTable from "../../PlTable";
import $$message from "../../$$message";
import {deepcopy} from "plain-utils/object/deepcopy";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {$$dialog} from "../../useDialog";
import {useAsyncMethods} from "../utils/useAsyncMethods";
import {useTableProEditForm} from "./use.edit-form";
import {defer} from "../../../utils/defer";

export function useTableMethods({tableState, config, pagination, hooks, currentNode}: {
    tableState: iTableState,
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableOptionHooks,
    currentNode: { value: TableNode | null | undefined },
}) {

    const freezeState = {
        effects: null as null | { onSave: () => void, onCancel: () => void },
        table: {} as typeof PlTable.use.class
    }

    const tablePropUseEditForm = useTableProEditForm()

    const utils = {
        getUrlConfig: <T extends keyof iTableProDefaultConfig["getDefaultUrlConfig"]>(type: T) => {
            const urlConfig: tUrlConfig<any> = (() => {
                if (!config.url) {throw new Error('option.config.url 不能为空！')}
                if (typeof config.url === "string") {
                    return {base: config.url}
                } else {
                    const base = config.url.base
                    const urlConfig = config.url[type]
                    return typeof urlConfig === "string" ? {url: urlConfig} : {...urlConfig as any, base}
                }
            })();
            let {request, ...requestConfig} = config.getDefaultUrlConfig[type]!(urlConfig)
            const requestData: any = (() => {
                const dataName = requestConfig.method === 'GET' ? 'query' : 'body'
                if (!requestConfig[dataName]) {requestConfig[dataName] = {}}
                return requestConfig[dataName]
            })();
            return {
                /*用来发送请求的request函数*/
                request: request as any as iTableProDefaultConfig["getDefaultUrlConfig"][T],
                /*请求参数，如果是GET请求，则为config.query，否则为config.body*/
                requestData,
                /*请求配置对象*/
                requestConfig,
            }
        },
    }

    const pageMethods = useAsyncMethods((() => {

        const load = async (loadConfig?: { page?: number, size?: number }) => {
            await editMethods.save()
            let targetLoadConfig = {
                page: !!loadConfig && loadConfig.page != null ? loadConfig.page : pagination.pageState.page,
                size: !!loadConfig && loadConfig.size != null ? loadConfig.size : pagination.pageState.size,
            }
            let {request, requestData, requestConfig} = utils.getUrlConfig('query')
            Object.assign(requestData, targetLoadConfig)
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            let {rows, hasNext} = await request(requestConfig)
            rows = await hooks.onAfterLoad.exec(rows)
            rows = await hooks.onLoaded.exec(rows)
            pagination.update({...targetLoadConfig, hasNext, list: rows})
            return rows
        }

        const reload = async (reloadConfig?: { size?: number }) => {
            const rows = await load({page: 0, size: !reloadConfig ? undefined : reloadConfig.size})
            pagination.updateTotal(null)
            return rows
        }

        const queryCount = async () => {
            await editMethods.save()
            let {request, requestData, requestConfig} = utils.getUrlConfig('query')
            Object.assign(requestData, {onlyCount: true})
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            let {total} = await request(requestConfig)
            pagination.updateTotal(total || null)
            return total
        }

        const next = async () => {
            const {page, hasNext} = pagination.pageState
            if (!hasNext) {return}
            return load({page: page + 1})
        }

        const prev = async () => {
            let page = pagination.pageState.page - 1
            if (page < 0) {return}
            return load({page})
        }

        const jump = async (page: number) => {
            if (page < 0) {return}
            if (page > pagination.pageState.page) {
                if (page === pagination.pageState.page + 1 && pagination.pageState.hasNext) {
                    return load({page})
                } else {
                    const total = await queryCount()
                    if (!total) {
                        const msg = '查询总数失败！'
                        $$notice.error(msg)
                        throw new Error(msg)
                    }
                    const totalPage = Math.ceil(total / pagination.pageState.size) - 1
                    if (page > totalPage) {page = totalPage}
                    return load({page})
                }
            } else {
                return load({page})
            }
        }

        return {load, reload, queryCount, next, prev, jump,}
    })())

    const editMethods = useAsyncMethods((() => {

        const insert = async (newRow?: Record<string, any>, editType?: eTableProEditType) => {
            await editMethods.save()

            let newRowData = deepcopy(newRow || (!config.defaultNewRow ? {} : (typeof config.defaultNewRow === "function" ? config.defaultNewRow() : config.defaultNewRow)))

            const editInline = async () => {
                tableState.editingWhenAddRow = true
                tableState.mode = TableMode.insert
                tableState.list.unshift(newRowData)
                await nextTick()
                const newNode = freezeState.table.flatNodes.value[0]
                newNode.validate()
                tableState.editingWhenAddRow = false

                freezeState.effects = {
                    onSave: async () => {
                        const validateResult = await newNode.validate()
                        if (!!validateResult) {
                            const {errors, node: {index}} = validateResult
                            $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                            return Promise.reject(validateResult)
                        }
                        let {request, requestConfig} = utils.getUrlConfig('insert')
                        requestConfig.body = deepcopy(newNode.editRow)
                        requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                        const newRowResult = await request!(requestConfig)
                        newNode.saveEdit(newRowResult.newRow)
                        newNode.closeEdit()
                        tableState.mode = TableMode.normal
                    },
                    onCancel: async () => {
                        tableState.mode = TableMode.normal
                        tableState.list.shift()
                    },
                }
            }
            const editForm = () => {
                const dfd = defer()
                const newNode = freezeState.table.utils.getTreeNodeByData({
                    data: newRowData,
                    level: 1,
                    parentRef: () => null as any,
                })
                tablePropUseEditForm.edit({
                    node: newNode,
                    title: '新建',
                    plcList: freezeState.table.plcData.value!.flatPlcList,
                    onConfirm: async (newNode) => {
                        let {request, requestConfig} = utils.getUrlConfig('insert')
                        requestConfig.body = deepcopy(newNode.editRow)
                        requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                        const newRowResult = await request!(requestConfig)
                        tableState.list.unshift(newRowResult.newRow)
                        dfd.resolve()
                    },
                    onCancel: dfd.resolve,
                })

                return dfd.promise
            }

            await ((editType || config.editType) === eTableProEditType.inline ? editInline() : editForm())
        }

        const batchInsert = async () => {
            await editMethods.save()
            const num = await new Promise<number>((resolve) => {
                $$dialog({
                    editRequired: true,
                    editType: 'number',
                    editValue: 10,
                    onConfirm: val => resolve(val as any),
                    confirmButton: true,
                    cancelButton: true,
                })
            })

            tableState.editingWhenAddRow = true
            tableState.mode = TableMode.insert
            const newRows = new Array(num).fill(null).map(() => deepcopy((!config.defaultNewRow ? {} : (typeof config.defaultNewRow === "function" ? config.defaultNewRow() : config.defaultNewRow))))
            tableState.list.unshift(...newRows)
            await nextTick()
            const newNodes = freezeState.table.flatNodes.value.slice(0, newRows.length)
            newNodes.forEach(node => {node.validate()})
            tableState.editingWhenAddRow = false

            freezeState.effects = {
                onSave: async () => {
                    const validateResults = (await Promise.all(newNodes.map(node => node.validate()))).filter(Boolean)
                    if (validateResults.length > 0) {
                        const {errors, node: {index}} = validateResults[0]!
                        $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                        return Promise.reject(validateResults[0])
                    }
                    let {request, requestConfig} = utils.getUrlConfig('batchInsert')
                    requestConfig.body = deepcopy(newNodes.map(node => node.editRow))
                    // todo
                    // requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                    await request!(requestConfig)
                    freezeState.effects = null
                    tableState.mode = TableMode.normal

                    await pageMethods.reload()
                },
                onCancel: async () => {
                    tableState.mode = TableMode.normal
                    tableState.list.splice(0, newRows.length)
                },
            }
        }

        const copy = async (row?: Record<string, any>) => {
            await editMethods.save()
            if (!row) {
                if (!currentNode.value) {
                    return $$notice.warn('请选中一行要删除的数据！')
                }
                row = deepcopy(currentNode.value.data)
            }
            const excludeKeys = [...config.copyDefaultExcludeKeys, ...config.copyExcludeKeys || []]
            excludeKeys.forEach(key => delete row![key])
            return editMethods.insert(row)
        }

        const update = async (node: TableNode, editType?: eTableProEditType) => {
            await editMethods.save()

            const editInline = async () => {
                if (node.edit) {return}
                tableState.mode = TableMode.update
                await nextTick()
                node.openEdit()
                node.validate()
                freezeState.effects = {
                    onSave: async () => {
                        const validateResult = await node.validate()
                        if (!!validateResult) {
                            const {errors, node: {index}} = validateResult
                            $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                            return Promise.reject(validateResult)
                        }
                        let {request, requestConfig} = utils.getUrlConfig('update')
                        requestConfig.body = deepcopy(node.editRow)
                        requestConfig = await hooks.onBeforeUpdate.exec(requestConfig)
                        const updateResult = await request!(requestConfig)
                        node.saveEdit(updateResult.newRow)
                        node.closeEdit()
                        tableState.mode = TableMode.normal
                    },
                    onCancel: async () => {
                        tableState.mode = TableMode.normal
                        node.cancelEdit()
                    },
                }
            }

            const editForm = async () => {
                const dfd = defer()
                tablePropUseEditForm.edit({
                    node: node,
                    title: '编辑',
                    plcList: freezeState.table.plcData.value!.flatPlcList,
                    onConfirm: async (updateNode) => {
                        let {request, requestConfig} = utils.getUrlConfig('update')
                        requestConfig.body = deepcopy(updateNode.editRow)
                        requestConfig = await hooks.onBeforeUpdate.exec(requestConfig)
                        const updateResult = await request!(requestConfig)
                        await node.saveEdit(updateResult.newRow)
                        dfd.resolve()
                    },
                    onCancel: dfd.resolve,
                })

                return dfd.promise
            }

            await ((editType || config.editType) === eTableProEditType.inline ? editInline() : editForm())
        }

        const batchUpdate = async () => {
            await editMethods.save()

            tableState.mode = TableMode.update
            const updateNodes = [...freezeState.table.flatNodes.value]
            await nextTick()
            updateNodes.forEach(node => {
                node.openEdit()
                node.validate()
            })
            freezeState.effects = {
                onSave: async () => {
                    const validateResults = (await Promise.all(updateNodes.map(node => node.validate()))).filter(Boolean)
                    if (validateResults.length > 0) {
                        const {errors, node: {index}} = validateResults[0]!
                        $$message.error(`第${index + 1}条记录校验不通过，${errors[0].label}:${errors[0].message}`)
                        return Promise.reject(validateResults[0])
                    }
                    let {request, requestConfig} = utils.getUrlConfig('batchUpdate')
                    requestConfig.body = deepcopy(updateNodes.map(node => node.editRow))
                    // todo
                    // requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                    await request!(requestConfig)
                    freezeState.effects = null
                    tableState.mode = TableMode.normal
                    await pageMethods.reload()
                },
                onCancel: async () => {
                    tableState.mode = TableMode.normal
                    updateNodes.forEach(node => {
                        node.cancelEdit()
                    })
                },
            }
        }

        const _delete = async () => {
            await editMethods.save()
            if (!currentNode.value) {
                return $$notice.warn('请选中一行要删除的数据！')
            }
            const {page, size} = pagination.pageState
            const {data, index} = currentNode.value
            await $$dialog.confirm(`确定要删除第${page * size + index + 1}条数据吗？`)

            let {request, requestConfig} = utils.getUrlConfig('delete')
            requestConfig.body = deepcopy(data)
            requestConfig = await hooks.onBeforeDelete.exec(requestConfig)
            const deleteResult = await request!(requestConfig)
            if (!!deleteResult.error) {
                return $$notice.error(`删除失败：${deleteResult.error}`)
            }
            tableState.list.splice(tableState.list.indexOf(data), 1)
        }

        const cancel = async () => {
            if (!freezeState.effects) {return}
            await freezeState.effects.onCancel()
            freezeState.effects = null
        }

        const save = async () => {
            if (!freezeState.effects) {return}
            await freezeState.effects.onSave()
            freezeState.effects = null
        }

        return {insert, batchInsert, copy, update, batchUpdate, delete: _delete, cancel, save,}
    })())

    hooks.onRefTable.use(table => freezeState.table = table)
    hooks.onDblClickCell.use(node => editMethods.update(node))
    hooks.onLoading.use(flag => {
        if (pageMethods.isLoading.all) {return true}
        if (editMethods.isLoading.all) {return true}
        return flag
    })

    return {
        editMethods,
        pageMethods,
    }
}

export type tTableMethods = ReturnType<typeof useTableMethods>