import {designComponent, useRefs} from "plain-design-composition";
import React from "react";

export const PlInputInnerTags = designComponent({
    name: 'pl-input-inner-tags',
    props: {
        data: {type: Array},
        collapseTags: {type: Boolean, default: true},
        placeholder: {type: String}
    },
    scopeSlots: {
        default: (scope: { item: any, index: number }) => {},
    },
    inheritPropsType: HTMLDivElement,
    setup({props, scopeSlots}) {
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        return {
            refer: {
                refs,
            },
            render: () => (
                <div className="pl-input-inner-tags" ref={onRef.el}>
                    <span className="pl-input-inner-tag-item pl-input-inner-tag-item-takeover">&nbsp;</span>
                    {(!props.data || props.data.length === 0) && (
                        <span className="pl-input-custom-placeholder">{props.placeholder}</span>
                    )}
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