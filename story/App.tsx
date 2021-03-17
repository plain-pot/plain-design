import React from "react";
import {AppMenu} from "./app/AppMenu";
import './app.scss'
import {AppNavigator} from "./app/AppNavigator";
import {PlRoot} from "../src/packages/PlRoot/PlRoot";

export const App = () => {
    return (
        <PlRoot>
            <div className="app-head">
                <div>plain-ui</div>
            </div>
            <AppMenu/>
            <AppNavigator/>
        </PlRoot>
    )
}