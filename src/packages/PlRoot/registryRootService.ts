/**
 * 用来注册root组件，建立 root 与 app中的 $root根实例的唯一对应关系
 * @author  韦胜健
 * @date    2020/11/26 9:32
 */
import {PlRoot} from "./PlRoot";
import {getCurrentDesignInstance} from "plain-design-composition";

export function createUseService<_,
    ManagerComponent extends { use: { class: any } },
    CreateService extends (getManager: () => Promise<ManagerComponent["use"]["class"]>, ctx: any) => any>(
    {
        name,
        managerComponent,
        createService,
    }: {
        name: string,
        managerComponent: ManagerComponent,
        createService: CreateService,
    }
) {
    /*不同的root，使用的service可能不一样*/
    let map = new WeakMap<any, ReturnType<CreateService>>()
    return () => {
        const root = PlRoot.use.inject()
        const ctx = getCurrentDesignInstance()
        let service = map.get(root)
        if (!!service) { return service}
        service = createService(async () => root.getManagerInstance(name, managerComponent), ctx)
        map.set(root, service!)
        return service!
    }
}