import {TableNode} from "../../../PlTable/table/use/useTableNode";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {tTableOption} from "../../index";
import useObject from "../../../useObject";

export function useDistinctFilter() {

    const {$object} = useObject()

    const pick = async ({}: { node: TableNode, plc: tPlc, option: tTableOption }) => {

        // const checked = await $object({option})

    }

    return {
        pick,
    }
}