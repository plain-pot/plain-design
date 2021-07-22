declare module '*.svg' {
    export default ''
}

declare namespace JSX {
    interface ElementClass {
        $props?: {}
    }

    interface ElementAttributesProperty {
        $props?: {}
    }
}
