import {TableMode, iTableProDefaultConfig, iTableState, tTableOptionConfig, tUrlConfig} from "../createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableHooks} from "./use.hooks";
import $$notice from "../../$$notice";
import {nextTick} from "../../../utils/nextTick";
import PlTable from "../../PlTable";
import $$message from "../../$$message";
import {deepcopy} from "plain-utils/object/deepcopy";
import {TableNode} from "../../PlTable/core/useTableNode";
import {$$dialog} from "../../useDialog";

export function useTableMethods({tableState, config, pagination, hooks, currentNode}: {
    tableState: iTableState,
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableHooks,
    currentNode: { value: TableNode | null | undefined },
}) {

    const freezeState = {
        effects: null as null | { onSave: () => void, onCancel: () => void },
        table: {} as typeof PlTable.use.class
    }

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

    const pageMethods = {
        load: async (loadConfig?: { page?: number, size?: number }) => {
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
        },
        reload: async (reloadConfig?: { size?: number }) => {
            const rows = await pageMethods.load({page: 0, size: !reloadConfig ? undefined : reloadConfig.size})
            pagination.updateTotal(null)
            return rows
        },
        queryCount: async () => {
            await editMethods.save()
            let {request, requestData, requestConfig} = utils.getUrlConfig('query')
            Object.assign(requestData, {onlyCount: true})
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            let {total} = await request(requestConfig)
            pagination.updateTotal(total || null)
            return total
        },
        next: async () => {
            const {page, hasNext} = pagination.pageState
            if (!hasNext) {return}
            return pageMethods.load({page: page + 1})
        },
        prev: async () => {
            let page = pagination.pageState.page - 1
            if (page < 0) {return}
            return pageMethods.load({page})
        },
        jump: async (page: number) => {
            if (page < 0) {return}
            if (page > pagination.pageState.page) {
                if (page === pagination.pageState.page + 1 && pagination.pageState.hasNext) {
                    return pageMethods.load({page})
                } else {
                    const total = await pageMethods.queryCount()
                    if (!total) {
                        const msg = '查询总数失败！'
                        $$notice.error(msg)
                        throw new Error(msg)
                    }
                    const totalPage = Math.ceil(total / pagination.pageState.size) - 1
                    if (page > totalPage) {page = totalPage}
                    return pageMethods.load({page})
                }
            } else {
                return pageMethods.load({page})
            }
        },
    }

    const editMethods = {
        insert: async (newRow?: Record<string, any>) => {
            await editMethods.save()
            tableState.editingWhenAddRow = true
            tableState.mode = TableMode.insert
            let newRowData = newRow || (!config.defaultNewRow ? {} : (typeof config.defaultNewRow === "function" ? config.defaultNewRow() : config.defaultNewRow))
            tableState.list.unshift(newRowData)
            tableState.insertRows = [tableState.list[0]]
            await nextTick()
            const newNode = freezeState.table.flatNodes.value[0]
            console.log('newNode', {...newNode})
            newNode.validate()
            tableState.editingWhenAddRow = false

            freezeState.effects = {
                onSave: async () => {
                    const validateResult = await newNode.validate()
                    if (!!validateResult) {
                        const {validateMessage, node: {index}} = validateResult
                        $$message.error(`第${index + 1}条记录校验不通过，${validateMessage}`)
                        return Promise.reject(validateResult)
                    }
                    let {request, requestConfig} = utils.getUrlConfig('insert')
                    requestConfig.body = deepcopy(newNode.editRow)
                    requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                    const newRowResult = await request!(requestConfig)
                    newNode.saveEdit(newRowResult.newRow)
                    newNode.closeEdit()
                    tableState.mode = TableMode.normal
                    tableState.insertRows = []
                },
                onCancel: async () => {
                    tableState.mode = TableMode.normal
                    tableState.list.shift()
                    tableState.insertRows = []
                },
            }
        },
        batchInsert: async () => {
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
            tableState.insertRows = [...tableState.list.slice(0, newRows.length)]
            await nextTick()
            const newNodes = freezeState.table.flatNodes.value.slice(0, newRows.length)
            newNodes.forEach(node => {
                console.log({...node})
                node.validate()
            })
            tableState.editingWhenAddRow = false

            freezeState.effects = {
                onSave: async () => {
                    const validateResults = (await Promise.all(newNodes.map(node => node.validate()))).filter(Boolean)
                    if (validateResults.length > 0) {
                        const {validateMessage, node: {index}} = validateResults[0]!
                        $$message.error(`第${index + 1}条记录校验不通过，${validateMessage}`)
                        return Promise.reject(validateResults[0])
                    }
                    let {request, requestConfig} = utils.getUrlConfig('batchInsert')
                    requestConfig.body = deepcopy(newNodes.map(node => node.editRow))
                    // todo
                    // requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                    await request!(requestConfig)
                    freezeState.effects = null
                    tableState.mode = TableMode.normal
                    tableState.insertRows = []

                    await pageMethods.reload()
                },
                onCancel: async () => {
                    tableState.mode = TableMode.normal
                    tableState.list.splice(0, newRows.length)
                    tableState.insertRows = []
                },
            }
        },
        copy: async (row?: Record<string, any>) => {
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
        },
        update: async (node: TableNode) => {
            await editMethods.save()

            if (node.edit) {return}

            tableState.mode = TableMode.update
            tableState.updateRows = [node.data]
            await nextTick()
            node.openEdit()
            node.validate()

            freezeState.effects = {
                onSave: async () => {
                    const validateResult = await node.validate()
                    if (!!validateResult) {
                        const {validateMessage, node: {index}} = validateResult
                        $$message.error(`第${index + 1}条记录校验不通过，${validateMessage}`)
                        return Promise.reject(validateResult)
                    }
                    let {request, requestConfig} = utils.getUrlConfig('update')
                    requestConfig.body = deepcopy(node.editRow)
                    requestConfig = await hooks.onBeforeUpdate.exec(requestConfig)
                    const updateResult = await request!(requestConfig)
                    node.saveEdit(updateResult.newRow)
                    node.closeEdit()
                    tableState.mode = TableMode.normal
                    tableState.updateRows = []
                },
                onCancel: async () => {
                    tableState.mode = TableMode.normal
                    node.cancelEdit()
                    tableState.updateRows = []
                },
            }
        },
        batchUpdate: async () => {
            await editMethods.save()

            tableState.mode = TableMode.update
            const updateNodes = [...freezeState.table.flatNodes.value]
            tableState.updateRows = [updateNodes.map(n => n.data)]
            await nextTick()
            updateNodes.forEach(node => {
                node.openEdit()
                node.validate()
            })
            freezeState.effects = {
                onSave: async () => {
                    const validateResults = (await Promise.all(updateNodes.map(node => node.validate()))).filter(Boolean)
                    if (validateResults.length > 0) {
                        const {validateMessage, node: {index}} = validateResults[0]!
                        $$message.error(`第${index + 1}条记录校验不通过，${validateMessage}`)
                        return Promise.reject(validateResults[0])
                    }
                    let {request, requestConfig} = utils.getUrlConfig('batchUpdate')
                    requestConfig.body = deepcopy(updateNodes.map(node => node.editRow))
                    // todo
                    // requestConfig = await hooks.onBeforeInsert.exec(requestConfig)
                    await request!(requestConfig)
                    freezeState.effects = null
                    tableState.mode = TableMode.normal
                    tableState.updateRows = []
                    await pageMethods.reload()
                },
                onCancel: async () => {
                    tableState.mode = TableMode.normal
                    updateNodes.forEach(node => {
                        node.cancelEdit()
                    })
                    tableState.updateRows = []
                },
            }
        },
        delete: async () => {
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
        },
        cancel: async () => {
            if (!freezeState.effects) {return}
            await freezeState.effects.onCancel()
            freezeState.effects = null
        },
        save: async () => {
            if (!freezeState.effects) {return}
            await freezeState.effects.onSave()
            freezeState.effects = null
        },
    }

    hooks.onRefTable.use(table => freezeState.table = table)
    hooks.onDblClickCell.use(node => editMethods.update(node))

    return {
        editMethods,
        pageMethods,
    }
}

export type tTableMethods = ReturnType<typeof useTableMethods>