import React from "react"
import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlImage from "../../../src/packages/PlImage";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
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
        </div>
    )
})