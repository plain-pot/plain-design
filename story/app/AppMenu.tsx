import {designComponent} from "plain-design-composition";
import React from "react";
import {Menu} from "./menu.utils";

export const AppMenu = designComponent({
    setup() {
        return () => (
            <div className="app-menu">
                {Menu.data.map(group => <React.Fragment key={group.name}>
                    <div className="app-menu-group" key={`group_${group.name}`}>
                        <span>{group.name}</span>
                    </div>
                    {group.children.map(menu => (
                        <div className="app-menu-item" key={`item_${menu.page}`}>
                            <span>{menu.name}</span>
                        </div>
                    ))}
                </React.Fragment>)}
            </div>
        )
    },
})