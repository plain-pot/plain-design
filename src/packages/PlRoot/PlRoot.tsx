import {designComponent, markRaw, reactive, ref} from "plain-design-composition"
import {StyleProps, useStyle} from "../../use/useStyle";
import {delay} from "plain-utils/utils/delay";
import React from "react";
import {createPortal} from 'react-dom'
import {RootController} from "./registryRootService";
import {useRefList} from "../../use/useRefList";

export const PlRoot = designComponent({
    name: 'pl-root',
    slots: ['default'],
    props: {
        ...StyleProps,
    },
    setup({slots}) {

        /*全局样式定义*/
        useStyle()
        /*controller代理对象引用*/
        let refs = useRefList<any>()
        /*当前状态*/
        const state = reactive({
            managers: [] as {
                name: string,
                Component: { use: { class: any } },
                RenderComponent: any,
            }[],
        })

        /**
         * 获取一个Controller实例
         * @author  韦胜健
         * @date    2020/11/5 10:19
         */
        async function getManagerInstance<ManagerComponent extends { use: { class: any } }>(
            name: string,
            managerComponent: ManagerComponent
        ): Promise<ManagerComponent["use"]["class"]> {
            if (!!refs) {
                for (let i = 0; i < refs.length; i++) {
                    const managerInstance = refs[i];
                    if (!!managerInstance) {
                        const {name: attrName, Component: attrComponent} = managerInstance.$attrs
                        if (name === attrName && managerComponent === attrComponent) {
                            return managerInstance as any
                        }
                    }
                }
            }
            /*当前引用中没有该实例，手动创建一个*/
            state.managers.push({
                name,
                Component: managerComponent,
                RenderComponent: markRaw(managerComponent),
            })
            await delay(0)
            return getManagerInstance(name, managerComponent)
        }

        const refer = {
            rootRef: () => refer,
            getManagerInstance,
        }
        RootController.initRoot(refer)

        return {
            refer,
            render: () => <>
                {slots.default()}
                {createPortal(
                    <div className="pl-root-service-container">
                        {state.managers.map(({name, Component, RenderComponent}, index) => (
                            <RenderComponent
                                key={index}
                                {...{name, Component}}
                                onRef={(refer: any) => refs[index] = refer}
                            />
                        ))}
                    </div>,
                    document.body,
                )}
            </>
        }
    },
})