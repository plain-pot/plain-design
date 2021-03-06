import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import React from "react";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useBasePlc} from "./useBasePlc";
import {applyPropsState, getPropsState} from "../utils/usePropsState";

export const Plc = designComponent({
    name: 'plc',
    props: PlcPropsOptions,
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event}) {
        return useBasePlc({props, scopeSlots, event})
    },
    expose: {
        applyPropsState,
        getPropsState,
    },
})

export default Plc