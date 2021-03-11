import React, {ReactNode, useEffect, useState} from 'react'
import {createContextHooks, createCtxContext, getContextByName, inject, provide, TopDesign} from "./context";
import {useOnce, useRender, useSetupProps} from "./hook";
import {installJSXModelPlugin} from "./installJSXModelPlugin";
import {ComponentPropsOptions, ExtractPropTypes, PropType} from './prop'
import {ComponentEvent, EmitToProp, ObjectEmitOptions, useEvent} from "./emit";
import {reactive, ref} from 'vue';
import {createCtxLifeCycle, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUpdated} from "./lifecycle";
import {SlotProps, useSetupSlots} from "./slot";
import {ScopeSlotProps, useSetupScopeSlot} from "./scope-slot";
import useClasses from "../use/useClasses";
import useModel from "../use/useModel";
import {useMounted} from '../use/useMounted';
import {useStyles} from '../use/useStyles';
import {useNumber} from '../use/useNumber';

interface InjectValue<Refer> {
    (): Refer,

    <DefaultValue>(defaultValue?: DefaultValue): Refer | DefaultValue
}

interface UseType<Refer, Props> {
    ref: () => Readonly<{ value: Refer }>,
    inject: InjectValue<Refer>
    class: Refer,
    props: Props,
}

function designComponent<_,
    Expose extends object,
    SetupProps extends Readonly<ExtractPropTypes<PropsOptions> & { children: any }>,
    FcProps extends ExtractPropTypes<PropsOptions, false>,
    SlotKeys extends string = '',
    PropsOptions extends Readonly<ComponentPropsOptions> = {},
    EmitOptions extends ObjectEmitOptions = {},
    ScopeSlots extends { [k: string]: (scope: any) => void } = {},
    Refer = unknown,
    __ = {}, >(
    {
        name,
        provideRefer,
        props,
        emits,
        setup,
        expose,
        slots,
        scopeSlots,
    }: {
        name?: string,
        provideRefer?: boolean,
        props?: PropsOptions,
        emits?: EmitOptions,
        expose?: Expose,
        slots?: SlotKeys[],
        scopeSlots?: ScopeSlots,
        setup?: (data: {
            props: SetupProps,
            event: ComponentEvent<EmitOptions>,
            slots: { [k in SlotKeys]: ((defaultReactNode?: ReactNode) => ReactNode) & { isExist: () => boolean } },
            scopeSlots: { [k in keyof ScopeSlots]: (scope: Parameters<ScopeSlots[k]>[0], defaultNode?: ReactNode) => ReactNode },
        }) => ({ refer: Refer, render: () => any } | (() => any)),
    }
) {

    const fc: React.FC<FcProps &
        EmitToProp<EmitOptions> &
        SlotProps<SlotKeys, ScopeSlots> &
        ScopeSlotProps<SlotKeys, ScopeSlots> &
        { children?: (SlotProps<SlotKeys, ScopeSlots> & ScopeSlotProps<SlotKeys, ScopeSlots>) | never[] | ('default' extends SlotKeys ? (ReactNode | (() => ReactNode)) : ('default' extends keyof ScopeSlots ? ((scope: Parameters<ScopeSlots['default']>[0]) => ReactNode) : never)) }> = (fcProps: any) => {

        const {setupProps} = useSetupProps(fcProps, props)
        const {setupEvent} = useEvent(fcProps, emits)
        const {provideHooks, injectHooks} = createContextHooks()
        const [{lifecycleManager, lifecycle}] = useState(createCtxLifeCycle())
        const {setupSlots} = useSetupSlots(fcProps, slots)
        const {setupScopeSlot} = useSetupScopeSlot(fcProps, scopeSlots)

        const render = useOnce(() => {
            TopDesign.ctx = {
                context: createCtxContext(provideHooks, injectHooks.inject),
                lifecycle,
            }
            if (!setup) {
                return () => null
            }
            const setupData = setup({
                props: setupProps,
                event: setupEvent,
                slots: setupSlots,
                scopeSlots: setupScopeSlot,
            })
            const renderFunc = typeof setupData === "function" ? setupData : setupData.render

            if (provideRefer) {
                if (!name) {
                    console.error('designComponent: component name is necessary when provideRefer is true!')
                } else {
                    if (typeof setupData === "function") {
                        console.error('designComponent: setup must return object {refer,render} when provideRefer is true!')
                    } else {
                        provide(`@@${name}`, setupData.refer)
                    }
                }
            }

            lifecycleManager.onBeforeMount.emit()
            TopDesign.ctx = null
            return renderFunc
        })

        injectHooks.useHook()
        const computedRender = useRender({
            render,
            memoDependencies: (() => {
                let keys = [] as string[]
                if (!!slots) {keys.push(...slots)}
                if (keys.length > 0) {keys.push('children')}

                return keys.map(key => fcProps[key])
            })(),
        });

        if (lifecycleManager.onBeforeUpdate.listeners.length > 0 || lifecycleManager.onUpdated.listeners.length > 0) {
            lifecycleManager.onBeforeUpdate.emit()
            useEffect(lifecycleManager.onUpdated.emit)
        }

        if (lifecycleManager.onMounted.listeners.length > 0 || lifecycleManager.onBeforeUnmount.listeners.length > 0) {
            useEffect(() => {
                lifecycleManager.onMounted.emit()
                return lifecycleManager.onBeforeUnmount.emit
            }, [])
        }

        return provideHooks.reduce((prev, item) => {
            const CTX = getContextByName(item.name)
            return (
                <CTX.Provider value={item.data}>
                    {prev}
                </CTX.Provider>
            )
        }, computedRender)
    }

    return Object.assign(fc, {
        use: {
            inject: (defaultValue?: any) => inject(`@@${name}`, defaultValue) as Refer,
            ref: () => ref<Refer>(),
            class: Object as any as Refer,
            props: Object as any as SetupProps,
        } as UseType<Refer, SetupProps>
    }, expose)
}

function useReference<T = any>(defaultValue?: T) {
    return reactive({
        current: defaultValue || null,
    })
}

export {
    designComponent,
    installJSXModelPlugin,
    ExtractPropTypes,
    PropType,
    provide, inject,
    onMounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated,
    useClasses, useModel, useMounted, useNumber, useStyles,
    useReference,
}

