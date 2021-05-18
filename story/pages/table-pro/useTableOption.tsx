import {createUseTableOption} from "../../../src";

export const useTableOption = createUseTableOption({
    keyField: 'id',
    bodyRowHeight: 48,
    headRowHeight: 48,
    indexing: true,
    border: false,
    showRow: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
    editType: 'inline',
    loadOnStart: true,
    defaultNewRow: {},
    copyDefaultExcludeKeys: ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
})