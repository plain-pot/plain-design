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
            'https://hbimg.huabanimg.com/d37bd949d9e923b7a628fc08c1c9a9dcc1b733d0156ce-6sHzzL_fw658/format/webp',
            'https://hbimg.huabanimg.com/d7b184c735bb1c2bba8756158036545c271ed4edfca6-ooLjWh_fw658/format/webp',
            'https://hbimg.huabanimg.com/4b2bd81337963d46c8936d735afc7569dfc2883fe4c5-PO5dhn_fw658/format/webp',
            'https://hbimg.huabanimg.com/3dceb727a5cb59cf7bdf1c456ed4573c62fa5f2fd68e7-IZWIFo_fw658/format/webp',
            'error.jpg',
            null,
        ])
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'预览多张图片'} onClick={previewMoreImage}/>
                <PlImage src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.article.pchome.net%2F00%2F30%2F12%2F54%2Fpic_lib%2Fs960x639%2F4069415s960x639.jpg&refer=http%3A%2F%2Fimg.article.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619275651&t=95d71838417d43db162d27e69dd80464'}/>
            </DemoRow>
            <DemoRow title={'限制图片大小'}>
                <PlImage src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.article.pchome.net%2F00%2F30%2F12%2F54%2Fpic_lib%2Fs960x639%2F4069415s960x639.jpg&refer=http%3A%2F%2Fimg.article.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619275651&t=95d71838417d43db162d27e69dd80464'} height={60} width={60}/>
            </DemoRow>
            <DemoRow title={'限制图片大小：图片缩放形式'}>
                {['fill', 'contain', 'cover', ' none', 'scale-down'].map(fit => (
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}} key={fit}>
                        <PlImage fit={fit as any} src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.article.pchome.net%2F00%2F30%2F12%2F54%2Fpic_lib%2Fs960x639%2F4069415s960x639.jpg&refer=http%3A%2F%2Fimg.article.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619275651&t=95d71838417d43db162d27e69dd80464'} height={60} width={60}/>
                        <span style={{marginTop: '8px'}}>{fit}</span>
                    </div>
                ))}
            </DemoRow>
            <DemoRow title={'自定义缩放位置'}>
                {['center top', 'cetner', 'center bottom'].map(position => (
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}} key={position}>
                        <PlImage fit={'cover'} position={position} src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.article.pchome.net%2F00%2F30%2F12%2F54%2Fpic_lib%2Fs960x639%2F4069415s960x639.jpg&refer=http%3A%2F%2Fimg.article.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619275651&t=95d71838417d43db162d27e69dd80464'} height={60} width={60}/>
                        <span style={{marginTop: '8px'}}>{position}</span>
                    </div>
                ))}
            </DemoRow>
            <DemoRow title={'四种状态'}>
                <PlImage status={'empty'}/>
                <PlImage status={'pending'}/>
                <PlImage status={'success'} src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.article.pchome.net%2F00%2F30%2F12%2F54%2Fpic_lib%2Fs960x639%2F4069415s960x639.jpg&refer=http%3A%2F%2Fimg.article.pchome.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619275651&t=95d71838417d43db162d27e69dd80464'} height={60} width={60}/>
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