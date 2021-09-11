import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {PlUpload, UploadFile} from "../../../PlUpload";
import {reactive} from "plain-design-composition";
import {defer} from "../../../../utils/defer";
import {tTableOptionMethods} from "../use.methods";
import {delay} from "plain-utils/utils/delay";
import {getInitialConfigState} from "../../../initialize";

export function useTableOptionSettingImport(
    {
        useTableOptionSettingInner,
        getSourceFlatPlcList,
        methods,
        closeSetting,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        getSourceFlatPlcList: () => tPlc[],
        methods: tTableOptionMethods,
        closeSetting: () => void,
    }) {

    const state = reactive({
        uploadFiles: [] as (UploadFile & { isDone?: boolean })[],
    })

    function fileToBuf(file: File): Promise<Buffer> {
        const fr = new FileReader();
        const dfd = defer<Buffer>()
        fr.readAsArrayBuffer(file);
        fr.addEventListener("loadend", (e) => {dfd.resolve(e.target!.result as any)}, false);
        return dfd.promise
    }

    const readFile = async (file: File): Promise<any[]> => {
        const ExcelJs = await getInitialConfigState('getExceljs')()
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.load(await fileToBuf(file))
        const sheet = workbook.getWorksheet(1)
        const plcList = getSourceFlatPlcList()
        let importPlcList: (tPlc | undefined)[] = [undefined]
        let importData: any[] = []
        sheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) {
                row.eachCell((cell) => {
                    const plcTitle = cell.value
                    const plc = plcList.find(i => i.props.title === plcTitle)
                    importPlcList.push(plc)
                })
            } else {
                const itemData = {} as any
                row.eachCell((cell, cellIndex) => {
                    const plc = importPlcList[cellIndex]
                    if (!plc) {return}
                    itemData[plc.props.field!] = cell.value
                })
                importData.push(itemData)
            }
        })
        return importData
    }

    const onUploadChange = async () => {
        setTimeout(() => {state.uploadFiles = []})
        const uploadFiles = state.uploadFiles.filter(i => !i.isDone);
        const importData = (await Promise.all(uploadFiles.map(async (item) => {
            item.isDone = true
            return readFile(item.file!)
        }))).flat()
        closeSetting()
        await delay(400)
        await methods.editMethods.batchInsert({rows: importData})
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.import,
        title: '导入数据',
        seq: 4,
        beforeOpen() {
            state.uploadFiles = []
        },
        render: () => <>
            <PlUpload
                v-model={state.uploadFiles}
                onChange={onUploadChange}
                draggable
                accept="excel"
                autoUpload={false}
            />
        </>
    })

}
