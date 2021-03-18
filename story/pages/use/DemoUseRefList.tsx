import {designClassComponent, designComponent, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup/PlButtonGroup";
import {PlButton} from "../../../src/packages/PlButton";
import {shuffle} from "plain-utils/object/shuffle";
import {PlList} from "../../../src/packages/PlList/PlList";
import {PlItem} from "../../../src/packages/PlItem/PlItem";
import {useRefList} from "../../../src/use/useRefList";
import {PropType} from "plain-design-composition/src/composition/prop-type";
import './DemoUseRefList.scss'

const Item = designClassComponent({
    props: {
        data: {type: Object as PropType<{ name: string, id: string }>, required: true},
        onAdd: {type: Function as PropType<() => void>, required: true},
        onRemove: {type: Function as PropType<() => void>, required: true},
    },
    setup({props}) {
        return {
            refer: {
                props,
                yes: 111,
            },
            render: () => (
                <PlItem key={props.data.name}>
                    <div className={"test-item"} key={props.data.name}>
                        <span>{props.data.name}</span>
                        <div style={{position: 'absolute', right: '8px', bottom: '8px'}}>
                            <PlButton label={'add'} status={'success'} size={'mini'} style={{marginRight: '8px'}}
                                      onClick={props.onAdd}
                            />
                            <PlButton label={'remove'} status={'success'} size={'mini'}
                                      onClick={props.onRemove}
                            />
                        </div>
                    </div>
                </PlItem>
            )
        }
    },
})

export default designComponent({
    setup() {

        let count = 0;

        const animations = [
            'elevator',
            'fade',
            'accordionVertical',
            'accordionHorizontal',
            'none',
        ] as any[]

        const state = reactive({
            cities: [
                {id: '广州市', name: '广州市'},
                {id: '上海市', name: '上海市'},
                {id: '北京市', name: '北京市'},
                {id: '深圳市', name: '深圳市'},
                {id: '长沙市', name: '长沙市'},
                {id: '南京市', name: '南京市'},
            ],
            animations: animations[0],
        })

        const handler = {
            add: (index: number) => {
                const item = state.cities[index]
                if (!item) return
                state.cities.splice(index + 1, 0, {
                    id: `count_${count++}`,
                    name: `${item.id}_${count}`,
                })
            },
            remove: (index: number) => {
                state.cities.splice(index, 1)
            },
        }

        const items = useRefList<{ props: { data: any } }>()

        return () => (
            <div className={'demo-use-ref-list'}>
                <DemoRow title={'测试useRefList'}>
                    <PlButtonGroup>
                        <PlButton onClick={() => handler.add(0)}>add</PlButton>
                        <PlButton onClick={() => handler.remove(0)}>remove</PlButton>
                        <PlButton onClick={() => state.cities = shuffle(state.cities)}>shuffle</PlButton>
                        <PlButton onClick={() => console.log(items.map(i => i.props.data.name))} label={'log items'}/>
                    </PlButtonGroup>
                </DemoRow>
                <DemoRow>
                    <PlList enterAnimation={state.animations} leaveAnimation={state.animations}>
                        {state.cities.map((city, index) => (
                                <Item
                                    key={city.id}
                                    data={city}
                                    onAdd={() => handler.add(index)}
                                    onRemove={() => handler.remove(index)}
                                    onRef={refer => items[index] = refer as any}
                                />
                            )
                        )}
                    </PlList>
                </DemoRow>
            </div>
        )
    },
})