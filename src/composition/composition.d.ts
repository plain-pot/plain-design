declare global {
    namespace JSX {
        interface Element {}

        interface ElementClass {
            $props?: {}
        }

        interface ElementAttributesProperty {
            $props?: {}
        }

        interface IntrinsicElements extends NativeElements {
            // allow arbitrary elements
            // @ts-ignore suppress ts:2374 = Duplicate string index signature.
            [name: string]: any
        }

        interface IntrinsicAttributes extends ReservedProps {}
    }
}

export {}