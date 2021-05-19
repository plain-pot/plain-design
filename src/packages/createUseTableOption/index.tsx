import {iTableProConfig, iTableProDefaultConfig} from "./createUseTableOption.utils";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config = {
            ...defaultConfig,
            ...customConfig,
        }
        

        return {
            config,
        }
    }
}

export default createUseTableOption