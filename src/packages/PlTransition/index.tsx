import {designClassComponent, designComponent, PropType, useMounted} from "plain-design-composition";
import React from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {createCounter} from "plain-design-composition/src/utils/createCounter";

const PlSwitchTransition = designComponent({
    props: {
        mode: {type: String as PropType<'out-in' | 'in-out'>, default: 'out-in'},
        name: {type: String, required: true},
    },
    emits: {
        onAfterEnter: () => true,
        onAfterLeave: () => true,
    },
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const count = createCounter('pl_transition')

        const state = {
            key: count(),
            prevKey: '' as any,
            prevType: null as any,
        }

        return () => {
            const children = slots.default() as any
            if (!children) {
                state.key = count()
            } else {
                const {key, type} = children
                if (key !== state.prevKey || type !== state.prevType) {
                    state.key = count()
                    state.prevKey = key
                    state.prevType = type
                }
            }
            return (
                <SwitchTransition mode={props.mode}>
                    <CSSTransition
                        key={state.key} classNames={props.name}
                        addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}>
                        {children}
                    </CSSTransition>
                </SwitchTransition>
            )
        }
    },
})

const PlDisappearTransition = designClassComponent({
    props: {
        name: {type: String, required: true},
        show: {type: Boolean},
        timeout: {type: Number, default: 300},
        unmount: {type: Boolean},
    },
    slots: ['default'],
    setup({props}) {

        /*props.show 初始值， setDisplayNone在mounted结束之后，需要根据这个判断是否给chlidren设置不显示*/
        let initShow = !!props.show as boolean | null
        /*是否已经mounted，没有mounted的情况下，setDisplayNone有效，设置children不显示*/
        const mounted = useMounted()
        /*unmount为false的情况下，每次动画结束之后，设置节点可见/不可见*/
        const binding = props.unmount ? {} : {
            onEnter: (el: HTMLElement) => {el.style.display = ''},
            onExited: (el: HTMLElement) => {el.style.display = 'none'},
        }

        /*因为render 比 watch要先执行，这里在render比较prevShow以及show已达到 watch props.show的效果*/
        let prevShow = props.show

        return () => {

            let children = props.children as any

            /*watch props.show*/
            if (mounted.value && initShow !== null) {
                if (prevShow !== props.show) {initShow = null}
            }

            /*是否要设置children不可见*/
            const setDisplayNone = (() => {
                /*如果没有mounted，直接设置不显示*/
                if (!mounted.value) {return true}
                /*show没有变化过，并且为false，设置不显示*/
                if (initShow != null && !initShow) {return true}
                return false
            })();

            if (!props.unmount) {
                if (!!children && setDisplayNone) {
                    /*当有children的情况下，在没有mounted的时候，以及初始化的时候没有show的情况下，直接设置 display:none*/
                    const childProps = children.props || {}
                    children = {...children, props: {...childProps, style: Object.assign({}, childProps.style, {display: 'none'})}}
                }
            }

            return (
                <CSSTransition
                    {...binding}
                    in={props.show && !setDisplayNone}
                    timeout={props.timeout}
                    classNames={props.name}
                    unmountOnExit={props.unmount}>
                    {children}
                </CSSTransition>
            )
        }
    },
})

/**
 * switch:      name,mode
 * disappear:   show,timeout,name
 * @author  韦胜健
 * @date    2021/3/19 21:44
 */
export const PlTransition: React.FC<{
    switch?: boolean,
    name: string,

    mode?: 'out-in' | 'in-out',

    show?: boolean,
    timeout?: number,
    unmount?: boolean,
}> = (props) => {
    if (props.switch) return <PlSwitchTransition {...props}/>
    else return <PlDisappearTransition {...props}/>
}

export default PlTransition