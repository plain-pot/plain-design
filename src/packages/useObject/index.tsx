import React from "react";
import {tTableOption} from "../createUseTableOption";
import useDialog from "../useDialog";
import PlTablePro from "../PlTablePro";

export function useObject() {

    const $dialog = useDialog()

    return (option: tTableOption) => {
        $dialog({
            title: option.config.title,
            render: () => <>
                <PlTablePro option={option}>

                </PlTablePro>
            </>
        })
    }
}

export default useObject
