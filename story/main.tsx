import ReactDom from 'react-dom'
import React from "react";
import {App} from "./App";
import '../src'

ReactDom.render(<App/>, document.querySelector('#app'))

async function loadText() {
    const resp = await fetch("https://ecp-sit-public.s3.cn-north-1.amazonaws.com.cn/ecp-public/o2mkt/mlto/rule/0/mlto_202103270101.html")
    const html = await resp.text()
    const match = html.match(/<body>(.*?)<\/body>/)
    if (!!match) {
        console.log(match[1])
    } else {
        console.log('内容格式不正确')
    }
}

loadText()