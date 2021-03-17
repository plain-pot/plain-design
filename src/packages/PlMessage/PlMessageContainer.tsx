import {reactive, designComponent, useRefList} from "plain-design-composition"
import useClass from "plain-design-composition/src/use/useClasses";
import {MessageServiceFormatOption} from "./index";
import {delay} from "plain-utils/utils/delay";
import {PlList} from "../PlList/PlList";
import React from "react";
import PlMessage from "./PlMessage";

export default designComponent({
    name: 'pl-message-container',
    props: {
        horizontal: {type: String, required: true},
        vertical: {type: String, required: true},
        duration: {type: String, default: "30px"},
    },
    setup({props}) {
        const classes = useClass(() => [
            'pl-message-container',
            `pl-message-container-${props.horizontal}-${props.vertical}`
        ])
        const state = reactive({
            options: [] as MessageServiceFormatOption[]
        })
        const refs = useRefList<{ option: MessageServiceFormatOption }>()
        const styles = {padding: props.duration}

        const utils = {
            closeMessage: (i: number) => {
                state.options.splice(i, 1)
            }
        }

        return {
            refer: {
                props,
                getMessage: async (option: MessageServiceFormatOption) => {
                    state.options.push(option)
                    await delay(0)
                    const messages = refs.filter(Boolean)
                    for (let i = 0; i < messages.length; i++) {
                        const message = messages[i];
                        if (message.option === option) {
                            return message
                        }
                    }
                    return null
                },
            },
            render: () => (
                <div className={classes.value} style={styles}>
                    <PlList animation={'accordionVertical'}>
                        {state.options.map((option, index) =>
                            <div className="pl-item" key={option.id}>
                                <PlMessage
                                    option={option}
                                    onRef={(proxy: any) => refs[index] = proxy}
                                    onClose={() => utils.closeMessage(index)}
                                />
                            </div>
                        )}
                    </PlList>
                </div>
            )
        }
    },
})