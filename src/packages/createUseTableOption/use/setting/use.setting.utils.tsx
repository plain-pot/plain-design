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
    filter = 'filter',
    sort = 'sort',
    config = 'config',
    import = 'import',
    export = 'export',
}
