import {ReactNode} from "react";

export type RequireFormat<T, P extends keyof T> = Required<{ [k in P]: T[k] }> & { [k in Exclude<keyof T, P>]: T[k] }
export type ModelType = { value: any }
export type SimpleObject = Record<string, any>
export type  VNodeChild = ReactNode