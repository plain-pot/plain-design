import React from "react";
import {AppMenu} from "./app/AppMenu";
import './app.scss'
import {AppNavigator} from "./app/AppNavigator";

export const App = () => {
    return <>
        <div className="app-head">
            <div>plain-ui</div>
        </div>
        <AppMenu/>
        <AppNavigator/>
    </>
}