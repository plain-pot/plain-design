import {designComponent, reactive, useRefList} from "plain-design-composition";
import {NoticeServiceDirection} from "./index";
import {PlNoticeContainer} from "./PlNoticeContainer";
import {delay} from "plain-utils/utils/delay";
import React from "react";

export const PlNoticeManager = designComponent({
    name: 'pl-notice-manager',
    props: {
        name: {required: true},
        Component: {required: true},
    },
    setup({props}) {

        const state = reactive({
            containers: [
                {
                    horizontal: NoticeServiceDirection.end,
                    vertical: NoticeServiceDirection.start,
                }] as { horizontal: NoticeServiceDirection, vertical: NoticeServiceDirection }[]
        })

        const refs = useRefList<typeof PlNoticeContainer.use.class>()

        const getContainer = async (config: { horizontal: NoticeServiceDirection, vertical: NoticeServiceDirection }): Promise<typeof PlNoticeContainer.use.class> => {
            for (let i = 0; i < refs.length; i++) {
                const ref = refs[i];
                if (ref.props.horizontal === config.horizontal && ref.props.vertical === config.vertical) {
                    return ref
                }
            }
            state.containers.push(config);
            await delay()
            return getContainer(config)
        }

        return {
            refer: {
                name: 'I am notice controller',
                getContainer,
                props,
            },
            render: () => (
                <div className="pl-notice-manager">
                    {state.containers.map((container, index) =>
                        <PlNoticeContainer
                            key={index}
                            horizontal={container.horizontal}
                            vertical={container.vertical}
                            ref={(proxy: any) => refs[index] = proxy}/>)}
                </div>
            )
        }
    },
})