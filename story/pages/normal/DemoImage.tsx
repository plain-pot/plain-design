import React from "react"
import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlImage from "../../../src/packages/PlImage";
import {DemoLine} from "../../components/DemoLine";
import PlImageUploader from "../../../src/packages/PlImageUploader";
import PlButton from "../../../src/packages/PlButton";
import {$$image} from "../../../src/packages/useImage";

export default designPage(() => {

    const state = reactive({
        uploadConfig: {
            action: 'http://193.112.75.134/server/upload/uploadFile',
            filename: 'file',
            data: {
                headId: '123',
                module: 'single',
            },
        },
        val: {
            0: 'http://193.112.75.134/upload//single/1352951926693560321/技术体系.png',
            1: 'error.png',
        },
    })

    const previewMoreImage = () => {
        $$image.preview([
            'http://193.112.75.134/upload//single/1375278150774161409/earth.jfif',
            'http://193.112.75.134/upload//single/1375278436934746113/cat.jfif',
            'http://193.112.75.134/upload//single/1352951926693560321/技术体系.png',
            'error.jpg',
            null,
        ])
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'预览多张图片'} onClick={previewMoreImage}/>
                <PlImage src={'http://193.112.75.134/upload//single/1375278150774161409/earth.jfif'}/>
            </DemoRow>
            <DemoRow title={'限制图片大小'}>
                <PlImage src={'http://193.112.75.134/upload//single/1375278150774161409/earth.jfif'} height={60} width={60}/>
            </DemoRow>
            <DemoRow title={'限制图片大小：图片缩放形式'}>
                {['fill', 'contain', 'cover', ' none', 'scale-down'].map(fit => (
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}} key={fit}>
                        <PlImage fit={fit as any} src={'http://193.112.75.134/upload//single/1375278150774161409/earth.jfif'} height={60} width={60}/>
                        <span style={{marginTop: '8px'}}>{fit}</span>
                    </div>
                ))}
            </DemoRow>
            <DemoRow title={'自定义缩放位置'}>
                {['center top', 'center', 'center bottom'].map(position => (
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}} key={position}>
                        <PlImage fit={'cover'} position={position} src={'http://193.112.75.134/upload//single/1375278150774161409/earth.jfif'} height={60} width={60}/>
                        <span style={{marginTop: '8px'}}>{position}</span>
                    </div>
                ))}
            </DemoRow>
            <DemoRow title={'四种状态'}>
                <PlImage status={'empty'}/>
                <PlImage status={'pending'}/>
                <PlImage status={'success'} src={'http://193.112.75.134/upload//single/1375278150774161409/earth.jfif'} height={60} width={60}/>
                <PlImage status={'error'}/>
            </DemoRow>
            <DemoRow title={'PlImageUploader'}>
                <DemoLine title={'图片有效'}>
                    <PlImageUploader v-model={state.val[0]} uploadConfig={state.uploadConfig}/>
                </DemoLine>
                <DemoLine title={'图片无效'}>
                    <PlImageUploader v-model={state.val[1]} uploadConfig={state.uploadConfig}/>
                </DemoLine>
                <DemoLine title={'上传失败'}>
                    <PlImageUploader uploadConfig={{action: '', filename: ''}}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})