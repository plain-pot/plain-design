import {KeyboardService} from "../../keyboard";

export function useTableOptionCommand() {

    KeyboardService.listen({
        'ctrl+q': () => {
            console.log('ctrl+q')
        }
    })

    return {}

}

export type tTableOptionCommand = ReturnType<typeof useTableOptionCommand>