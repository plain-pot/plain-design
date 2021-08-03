import useTableOption from "./useTableOption";

const useObjectOption: typeof useTableOption = (config) => {

    config.fill = undefined

    if (config.enable == null) {
        config.enable = false
    }

    const option = useTableOption(config)

    if (option.config.showRows == null) {
        config.showRows = Math.ceil((document.body.offsetHeight * 0.8 - 200) / option.config.bodyRowHeight) - 1
    }

    return option
}

export default useObjectOption
