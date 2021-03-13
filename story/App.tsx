import React from "react";
import {AppMenu} from "./app/AppMenu";
import './app.scss'

export const App = () => {
    return (
        <div className="app-home">
            <div className="app-head">
                <div>plain-ui</div>
            </div>
            <AppMenu/>
        </div>
    )
}