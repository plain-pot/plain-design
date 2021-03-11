import {designComponent, inject, provide} from '../composition';
import React from 'react';
import {reactive} from "vue";

const PROVIDE_STRING = '@@PROVIDE_STRING'

export const ProvideDemo = designComponent({
    setup() {
        return () => {
            // console.log('demo render')
            return (
                <div>
                    <h1>provide demo</h1>
                    <A/>
                </div>
            )
        }
    },
})

const A = designComponent({
    setup() {

        const state = reactive({
            text: 'A initial value'
        })
        provide(PROVIDE_STRING, state)

        return () => {
            return (
                <div>
                    <span style={{marginRight: '20px'}}>A</span><input type="text" v-model={state.text}/>
                    <div style={{padding: '20px'}}>
                        <B/>
                        <B/>
                        <C>
                            {{
                                default: () => (
                                    <div>
                                        111
                                    </div>
                                )
                            }}
                        </C>
                    </div>
                </div>
            )
        }
    },
})

const B = designComponent({
    setup() {
        const state = reactive({
            text: 'B initial value'
        })
        provide(PROVIDE_STRING, state)

        return () => {
            // console.log('B render')
            return (
                <div>
                    <span style={{marginRight: '20px'}}>B</span><input type="text" v-model={state.text}/>
                    <div>
                        <C>
                            <div>
                                123
                            </div>
                        </C>
                    </div>
                </div>
            )
        }
    }
})

const C = designComponent({
    slots: [
        'default',
        'prepend',
        'append'
    ],
    setup() {

        const parentState = inject(PROVIDE_STRING)

        return () => {
            // console.log('C render')
            return (<div style={{margin: '20px'}}>
                i am C:[{parentState.text}]
            </div>)
        }
    },
})

