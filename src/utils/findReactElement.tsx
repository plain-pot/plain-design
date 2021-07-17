import {ReactElement, ReactNode} from "react";
import {isElement, isFragment} from 'react-is'

export function findRreactElement(node: ReactNode, isMatch: (node: ReactElement) => boolean): ReactNode[] | null {
    if (node == null) {return null}
    const type = typeof node
    switch (type) {
        case "number":
        case "string":
        case "boolean":
            return null
    }

    if (Array.isArray(node) && node.length > 0) {
        const ret: ReactNode[] = []
        node.forEach(n => {
            const findList = findRreactElement(n, isMatch)
            if (!!findList && findList.length > 0) {
                ret.push(...findList)
            }
        })
        return ret
    } else if (isFragment(node)) {
        return findRreactElement(node.props.children, isMatch)
    } else if (isElement(node)) {
        if (isMatch(node)) {
            return [node]
        }
    }

    return null
}