import {useRefList} from "../../use/useRefList";
import {designComponent, ref} from "plain-design-composition";
import {delay} from "plain-utils/utils/delay";
import React from "react";

/**
 * 创建一个默认的 root service manager组件
 * @author  韦胜健
 * @date    2020/11/26 9:20
 */
export function createDefaultManager<Option>(
    managerName: string,
    serviceComponent: {
        use: {
            class: {
                isShow: { value: boolean },
                isOpen: { value: boolean },
                service: (option: Option) => any,
            }
        }
    },
    isItemAvailable?: (refs: typeof serviceComponent.use.class[], opt: Option) => null | typeof serviceComponent.use.class,
) {
    return designComponent({
        name: managerName,
        props: {
            name: {required: true},
            Component: {required: true},
        },
        setup({props}) {

            const options = ref([] as Option[])
            const refs = useRefList<typeof serviceComponent["use"]["class"]>()

            /**
             * 获取一个 非show以及open的 service提供服务，如果存在
             * 符合这个条件的service，直接调用service函数，否则创建
             * 一个service，这个service在setup末尾需要调用一次service
             * 函数；
             * @author  韦胜健
             * @date    2020/11/26 9:23
             */
            const service = async (option: Option): Promise<void> => {
                if (isItemAvailable) {
                    const item = isItemAvailable(refs, option)
                    if (!!item) {
                        return item.service(option)
                    }
                } else {
                    for (let i = 0; i < refs.length; i++) {
                        const item = refs[i];
                        const {isShow, isOpen} = item
                        if (!isShow.value && !isOpen.value) {
                            return item.service(option)
                        }
                    }
                }

                // 没有合适的item，创建新的item提供服务
                options.value.push(option as any)
                await delay()
            }

            return {
                refer: {
                    managerName,
                    service,
                    props,
                },
                render: () => {
                    const ServiceComponent = serviceComponent as any
                    return (
                        <div className={managerName}>
                            {options.value.map((opt, i) => <ServiceComponent
                                key={i}
                                option={opt}
                                onRef={(proxy: any) => refs[i] = proxy}
                            />)}
                        </div>
                    )
                }
            }
        },
    })
}