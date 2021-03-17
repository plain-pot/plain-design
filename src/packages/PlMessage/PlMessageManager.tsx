import {designComponent, reactive} from "plain-design-composition";
import {MessageServiceDirection} from "./index";
import {useRefList} from "../../use/useRefList";
import PlMessageContainer from "./PlMessageContainer";
import {delay} from "plain-utils/utils/delay";
import React from "react";

export const PlMessageManager = designComponent({
    name: 'pl-message-manager',
    setup() {

        const state = reactive({
            containers: [
                {
                    horizontal: MessageServiceDirection.center,
                    vertical: MessageServiceDirection.start,
                }] as { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }[]
        })
        const refs = useRefList<typeof PlMessageContainer.use.class>()

        const getContainer = async (config: { horizontal: MessageServiceDirection, vertical: MessageServiceDirection }): Promise<typeof PlMessageContainer.use.class> => {
            for (let i = 0; i < refs.length; i++) {
                const ref = refs[i];
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
                getContainer,
            },
            render: () => (
                <div className="pl-message-manager">
                    {state.containers.map((container, index) =>
                        <PlMessageContainer
                            horizontal={container.horizontal}
                            vertical={container.vertical}
                            onRef={(proxy: any) => refs[index] = proxy}/>)}
                </div>
            )
        }
    },
})