import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup/PlButtonGroup";
import {PlButton} from "../../../src/packages/PlButton/PlButton";
import {PlList} from "../../../src/packages/PlList/PlList";
import './DemoList.scss'

export default designComponent({
    setup() {

        let count = 0;

        const state = reactive({
            cities: [
                {id: '广州市', name: '广州市'},
                {id: '上海市', name: '上海市'},
                {id: '北京市', name: '北京市'},
                {id: '深圳市', name: '深圳市'},
                {id: '长沙市', name: '长沙市'},
                {id: '南京市', name: '南京市'},
            ]
        })
        return () => (
            <div className={'demo-list'}>
                <DemoRow title={'基本用法，设置动画'}>
                    <PlButtonGroup>
                        <PlButton>add</PlButton>
                        <PlButton>remove</PlButton>
                        <PlButton>shuffle</PlButton>
                    </PlButtonGroup>
                </DemoRow>
                <DemoRow>
                    <PlList>
                        {state.cities.map((city, index) => (
                            <div className={"test-item"} key={city.name}>
                                <span>{city.name}</span>
                                <div style={{position: 'absolute', right: '8px', bottom: '8px'}}>
                                    <PlButton label={'add'} status={'success'} size={'mini'} style={{marginRight: '8px'}}
                                              onClick={() => state.cities.splice(index + 1, 0, {
                                                  id: `count_${count++}`,
                                                  name: `${city.id}_${count}`,
                                              })}
                                    />
                                    <PlButton label={'remove'} status={'success'} size={'mini'}
                                              onClick={() => state.cities.splice(index, 1)}
                                    />
                                </div>
                            </div>)
                        )}
                    </PlList>
                </DemoRow>
            </div>
        )
    },
})