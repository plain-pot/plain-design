import React from "react";
import './app.scss'
import {$$message, PlButton, PlRoot} from 'plain-design'
import 'plain-design/dist/plain-design.min.css'

export const App = () => {
    return (
        <PlRoot>
            <PlButton label={'按钮'} onClick={() => $$message('click')}/>
            <div>
                this is app
            </div>
        </PlRoot>
    )
}