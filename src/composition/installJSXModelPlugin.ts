import React from "react";
import {isDom} from "./utils";

export function installJSXModelPlugin(react: typeof React) {
    (react as any).$$set = (target: any, property: string, event: any) => {
        let value;
        if (event == null) {
            value = event;
        } else if (!!event.target && isDom(event.target)) {
            const nativeEvent = event.nativeEvent || event
            /*修复问题：中文输入法的情况下，每次按键都会增加一个空格*/
            if (nativeEvent.inputType === 'insertCompositionText') {return}
            value = event.target.value;
        } else {
            value = event;
        }
        target[property] = value;
    }
}