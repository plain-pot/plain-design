import {ReactNode} from "react";

export interface iTableOptionSettingConfig {
    key: eTableOptionSettingView,
    title: string,
    seq: number,
    render: () => ReactNode,
    beforeOpen?: () => void | Promise<void>,
}

export interface iTableOptionSettingInnerUser {
    (config: iTableOptionSettingConfig): void
}

export enum eTableOptionSettingView {
    seniorFilter = 'seniorFilter',
    allFilter = 'allFilter',
    sort = 'sort',
    config = 'config',
    import = 'import',
    export = 'export',
}
