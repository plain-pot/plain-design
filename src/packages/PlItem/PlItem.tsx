import React from "react";
import {StyleProperties} from "plain-design-composition/src/use/useStyles";

export class PlItem extends React.Component<{
    className?: string,
    style?: StyleProperties,
    tag?: any,
    children?: any,
}, any> {
    render() {
        let {tag: Tag, className, style, children, ...props} = this.props;
        !Tag && (Tag = 'div');
        return (
            <Tag className={`pl-item ${className}`}
                 style={style as any}
                 {...props}>
                {children}
            </Tag>
        );
    }
}
