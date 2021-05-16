import {iTableProConfig, iTableProDefaultConfig} from "./createUseTablePro.utils";

export function createTablePro(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig) => {

        const config = {
            ...defaultConfig,
            ...customConfig,
        }

        return {
            config,
        }
    }
}

export default createTablePro