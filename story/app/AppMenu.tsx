import {designComponent} from "plain-design-composition";
import React from "react";
import {Menu} from "./menu.utils";
import {PlIcon} from "../../src/packages/PlIcon";

export const AppMenu = designComponent({
    setup() {
        return () => (
            <div className="app-menu">
                {Menu.data.map(group => <React.Fragment key={group.name}>
                    <div className="app-menu-group" key={`group_${group.name}`}>
                        <span>{group.name}</span>
                    </div>
                    {group.children.map(menu => (
                        <div className="app-menu-item" key={`item_${menu.page}`} onClick={() => Menu.openMenu(menu)}>
                            <span>{menu.name}</span>
                            <span>{menu.title}</span>

                            {!!menu.complete && (
                                <div className="app-menu-item-is-done">
                                    <PlIcon icon="el-icon-star-on"/>
                                </div>
                            )}
                        </div>
                    ))}
                </React.Fragment>)}
            </div>
        )
    },
})