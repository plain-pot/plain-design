import {designComponent} from "plain-design-composition";
import React from "react";

export const AppMenu = designComponent({
    setup() {
        return () => (
            <div className="app-menu">
                this is app menu
            </div>
        )
    },
})