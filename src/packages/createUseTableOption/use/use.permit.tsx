import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {usePermission} from "./userPermission";

export function useTableOptionPermit({config, hooks}: { config: tTableOptionConfig, hooks: tTableOptionHooks }) {
    const {init, permit} = usePermission(config)
    hooks.onInit.use(async () => {await init})
    return permit
}