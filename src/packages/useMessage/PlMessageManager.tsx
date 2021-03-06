import {designComponent, useRefList, reactive} from "plain-design-composition";
import {MessageServiceDirection} from "./index";
import PlMessageContainer from "./PlMessageContainer";
import {delay} from "plain-utils/utils/delay";
import React from "react";

export const PlMessageManager = designComponent({
    name: 'pl-message-manager',
    props: {
        name: {required: true},
        Component: {required: true},
    },
    setup({props}) {

        const state = reactive({
            containers: [
                {
                    horizontal: MessageServiceDirection.center,
                    vertical: MessageServiceDirection.start,
                }] as { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }[]
        })
        const {refList, onRefList} = useRefList(PlMessageContainer)

        const getContainer = async (config: { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }): Promise<typeof PlMessageContainer.use.class> => {
            for (let i = 0; i < refList.length; i++) {
                const ref = refList[i];
                if (ref.props.horizontal === config.horizontal && ref.props.vertical === config.vertical) {
                    return ref
                }
            }
            state.containers.push(config);
            await delay(0)
            return getContainer(config)
        }
        return {
            refer: {
                name: 'I am message controller',
                props,
                getContainer,
            },
            render: () => (
                <div className="pl-message-manager">
                    {state.containers.map((container, index) =>
                        <PlMessageContainer
                            key={index}
                            horizontal={container.horizontal}
                            vertical={container.vertical}
                            ref={onRefList(index)}/>)}
                </div>
            )
        }
    },
})