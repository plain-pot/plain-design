import {designComponent} from "plain-design-composition";
import React from "react";

export const PlInputInnerTags = designComponent({
    name: 'pl-input-inner-tags',
    props: {
        data: {type: Array},
        collapseTags: {type: Boolean, default: true},
    },
    scopeSlots: {
        default: (scope: { item: any, index: number }) => {},
    },
    setup({props, scopeSlots}) {
        return {
            render: () => (
                <div className="pl-input-inner-tags">
                    <span className="pl-input-inner-tag-item pl-input-inner-tag-item-takeover">&nbsp;</span>
                    {
                        (props.collapseTags ? props.data!.slice(0, 3) : props.data!).map((item: any, index) => (
                            <span key={index} className="pl-input-inner-tag-item">
                            {scopeSlots.default({item, index}, null)}
                        </span>
                        ))
                    }
                    {props.collapseTags && props.data!.length > 3 && <span className="pl-input-inner-tag-item">+{props.data!.length - 3}</span>}
                </div>
            )
        }
    },
})