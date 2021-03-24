import {createServiceWithoutContext, createUseService} from "../PlRoot/registryRootService";
import {createDefaultManager} from "../PlRoot/createDefaultManager";
import {ContextContent, ContextmenuReference, ContextmenuServiceOption, getReferencePosition, PlContextMenuService, PlContextMenuServiceComponent} from "./PlContextMenuService";

export const useContextmenu = createUseService({
        name: 'contextmenu',
        managerComponent: createDefaultManager('pl-contextmenu-service-manager', PlContextMenuService, ((items: PlContextMenuServiceComponent[], option: ContextmenuServiceOption) => {

            const newPos = getReferencePosition(option.reference)
            let exist: PlContextMenuServiceComponent | null = null
            let available: PlContextMenuServiceComponent | null = null
            items.forEach(item => {
                if (!!exist) {
                    return
                }
                if (item.state.option === option) {
                    exist = item
                    return;
                }
                const oldPos = getReferencePosition(item.state.option.reference)
                if (oldPos.top === newPos.top && oldPos.left === newPos.left) {
                    exist = item
                    return;
                }
                if (!item.isShow.value && !item.isOpen.value) {
                    available = item
                }
            })
            return exist || available
        }) as any),
        createService: (getManager) => {
            return async (reference: ContextmenuReference, content: ContextContent) => {
                const option = {reference, content}
                const manager = await getManager()
                return manager.service(option)
            }
        }
    },
)

export default useContextmenu

export const $$contextmenu = createServiceWithoutContext(useContextmenu)