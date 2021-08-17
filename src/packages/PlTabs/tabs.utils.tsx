import {PlTabComponent} from "../PlTab";
import {PropType} from "plain-design-composition/src/index";

export enum TabHeadType {
    text = 'text',
    card = 'card',
    shadow = 'shadow',
}

export enum TabHeadPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right',
}

export const TabCommonProps = {
    headType: {type: String as PropType<keyof typeof TabHeadType>, default: TabHeadType.text},
    headPosition: {type: String as PropType<keyof typeof TabHeadPosition>, default: TabHeadPosition.top},
}

export type TabData = { item: PlTabComponent, index: number, active: boolean }
