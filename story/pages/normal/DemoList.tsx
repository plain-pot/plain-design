import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup/PlButtonGroup";
import {PlButton} from "../../../src/packages/PlButton/PlButton";
import {PlList} from "../../../src/packages/PlList/PlList";
import './DemoList.scss'
import {shuffle} from "plain-utils/object/shuffle";
import {PlItem} from "../../../src/packages/PlItem/PlItem";

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

        return () => (
            <div className={'demo-list'}>
                <DemoRow title={'基本用法，设置动画'}>
                    <PlButtonGroup>
                        <PlButton onClick={() => handler.add(0)}>add</PlButton>
                        <PlButton onClick={() => handler.remove(0)}>remove</PlButton>
                        <PlButton onClick={() => state.cities = shuffle(state.cities)}>shuffle</PlButton>
                    </PlButtonGroup>
                </DemoRow>
                <DemoRow title={'动画'}>
                    {animations.map(ani => (
                        <PlButton label={ani} active={state.animations === ani} key={ani} onClick={() => state.animations = ani}/>
                    ))}
                </DemoRow>
                <DemoRow>
                    <PlList enterAnimation={state.animations} leaveAnimation={state.animations}>
                        {state.cities.map((city, index) => (
                            <PlItem key={city.name}>
                                <div className={"test-item"} key={city.name}>
                                    <span>{city.name}</span>
                                    <div style={{position: 'absolute', right: '8px', bottom: '8px'}}>
                                        <PlButton label={'add'} status={'success'} size={'mini'} style={{marginRight: '8px'}}
                                                  onClick={() => handler.add(index)}
                                        />
                                        <PlButton label={'remove'} status={'success'} size={'mini'}
                                                  onClick={() => handler.remove(index)}
                                        />
                                    </div>
                                </div>
                            </PlItem>)
                        )}
                    </PlList>
                </DemoRow>
            </div>
        )
    },
})