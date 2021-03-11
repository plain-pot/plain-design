import React, {useState, useMemo} from "react";
import {installJSXModelPlugin} from "./composition";
import {ProvideDemo} from "./demo/ProvideDemo";
import {ModelDemo} from "./demo/ModelDemo";
import {PropDemo} from "./demo/PropDemo";
import {AntdDemo} from "./demo/AntdDemo";
import {LifecycleDemo} from "./demo/LifecycleDemo";
import {SlotDemo} from "./demo/SlotDemo";
import './app.css'
import {ScopeSlotDemo} from "./demo/ScopeSlotDemo";
import {DemoUseModel} from "./demo/use/DemoUseModel";
import {DemoUseMounted} from "./demo/use/DemoUseMounted";

installJSXModelPlugin(React)

export const App = () => {

    const [route, setRoute] = useState(() => {
        return window.localStorage.getItem('current_route')
    })

    const uses = [
        {name: 'useModel', component: <DemoUseModel/>},
        {name: 'useMounted', component: <DemoUseMounted/>},
    ]

    const demos = [
        {name: 'model 双向绑定示例', component: <ModelDemo/>},
        {name: 'context 注入示例', component: <ProvideDemo/>},
        {name: 'prop 属性定义示例', component: <PropDemo/>},
        {name: 'Antd 使用示例', component: <AntdDemo/>},
        {name: 'lifecycle 生命钩子示例', component: <LifecycleDemo/>},
        {name: 'slot 插槽示例', component: <SlotDemo/>},
        {name: 'scopeSlot 作用域插槽示例', component: <ScopeSlotDemo/>},
        ...uses,
    ]

    const Content = useMemo(() => demos.find(i => i.name === route), [route])

    const changeRoute = (routeName: string) => {
        setRoute(routeName)
        window.localStorage.setItem('current_route', routeName)
    }

    return (
        <div style={{padding: '20px'}}>
            {demos.map(demo => <button key={demo.name} onClick={() => changeRoute(demo.name)}>{demo.name}</button>)}
            {!!Content && <>
                <div key={Content.name}>
                    <h1>{Content.name}</h1>
                    {Content.component}
                </div>
            </>}
        </div>
    )
}