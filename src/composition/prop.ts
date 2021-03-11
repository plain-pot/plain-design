type Data = Record<string, unknown>;

type DefaultFactory<T> = (props: Data) => T | null | undefined;

type PropMethod<T, TConstructor = any> = T extends (...args: any) => any ? {
    new(): TConstructor;
    (): T;
    readonly prototype: TConstructor;
} : never;

export type PropConstructor<T = any> = {
    new(...args: any[]): T & object;
} | { (): T; } | PropMethod<T>;

export type PropType<T> = PropConstructor<T> | PropConstructor<T>[];

interface PropOptions<T = any, D = T> {
    type?: PropType<T> | true | null;
    required?: boolean;
    default?: D | DefaultFactory<D> | null | undefined | object;

    validator?(value: unknown): boolean;
}

type RequiredKeys<T, MakeDefaultRequired> = {
    [K in keyof T]: T[K] extends {
        required: true;
    } | (MakeDefaultRequired extends true ? {
        default: any;
    } : never) ? K : never;
}[keyof T];

type OptionalKeys<T, MakeDefaultRequired> = Exclude<keyof T, RequiredKeys<T, MakeDefaultRequired>>;

declare type InferPropType<T> = T extends null ? any : T extends {
    type: null | true;
} ? any : T extends ObjectConstructor | {
    type: ObjectConstructor;
} ? Record<string, any> : T extends BooleanConstructor | {
    type: BooleanConstructor;
} ? boolean : T extends Prop<infer V, infer D> ? (unknown extends V ? D : V) : T;

type Prop<T, D = T> = PropOptions<T, D> | PropType<T>;

export type ExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = O extends object ? (
    { [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]> } &
    { [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]> }
    ) : { [K in string]: any };

type ComponentObjectPropsOptions<P = Data> = {
    [K in keyof P]: Prop<P[K]> | null;
};
export type ComponentPropsOptions<P = Data> = ComponentObjectPropsOptions<P> | string[];