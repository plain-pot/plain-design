import {
    createCounter,
    UnwrapRef,
    ref,
    provide,
    inject,
    onMounted,
    onBeforeUnmount,
    markRaw,
    getCurrentDesignInstance,
    Ref,
} from 'plain-design-composition';

type UseCollectComponent = { options: { name?: string }; use: { class: any } };
type UseCollectSort = (() => HTMLElement) | number;

interface ParentCollector<Child extends { use: { class: any } }> {

    (): UnwrapRef<Child['use']['class']>[],

    (flag: true): Ref<UnwrapRef<Child['use']['class']>[]>,

}

const counter = createCounter('use_collector');

function useCollectInParentInner() {
    const indexMap = new WeakMap<any, number>();

    const items = ref([] as any[]);
    const utils = {
        addItem: (item: any, sort?: UseCollectSort) => {
            if (sort) {
                if (typeof sort !== 'number') {
                    const el = sort();
                    // eslint-disable-next-line
                    sort = Array.from(el!.parentNode!.childNodes)
                        .filter(
                            (childNode: any) =>
                                childNode.nodeName !== '#comment' &&
                                (!childNode.style || childNode.style.display !== 'none'),
                        )
                        .indexOf(el);
                    // console.log(el, sort)
                }
                items.value.push(item);
                // eslint-disable-next-line
                item = items.value[items.value.length - 1];
                indexMap.set(item, sort as number);
                items.value.sort((a, b) => indexMap.get(a)! - indexMap.get(b)!);
            } else {
                items.value.push(item);
            }
        },
        removeItem: (item: any) => {
            const index = items.value.indexOf(item);
            if (index > -1) items.value.splice(index, 1);
        },
    };
    return {
        parent: {} as any, // 类型提示，实际上无用处
        items,
        utils,
    };
}

export function useCollect<Parent extends UseCollectComponent, Child extends UseCollectComponent>(
    config: () => {
        parent: Parent;
        child: Child;
    },
) {
    const {parent} = config();
    const parentName = parent.options.name || counter();
    const provideString = `@@Collector_${parentName}`;

    const parentCollector: ParentCollector<Child> = ((flag?: true) => {
        const ctx = getCurrentDesignInstance();
        const {items, utils} = useCollectInParentInner();
        const data: ReturnType<typeof useCollectInParentInner> = {
            items,
            utils,
            parent: ctx.proxy,
        };
        provide(provideString, data);
        return flag ? items : items.value;
    }) as any;

    return {
        parent: parentCollector,
        child: ({
                    injectDefaultValue,
                    sort,
                }: {
            injectDefaultValue?: any;
            sort?: UseCollectSort;
        } = {}): Parent['use']['class'] => {
            const data = inject(provideString, injectDefaultValue) as ReturnType<typeof useCollectInParentInner>;
            if (data) {
                const ctx = getCurrentDesignInstance();
                const child = markRaw(ctx);
                onMounted(() => data.utils.addItem(child.proxy, sort));
                onBeforeUnmount(() => data.utils.removeItem(child.proxy));
                return data.parent;
            } else {
                return null;
            }
        },
    };
}
