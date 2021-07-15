import useTableOption from "./useTableOption";

const useObjectOption: typeof useTableOption = (config) => {
    if (config.enable == null) {config.enable = false}
    return useTableOption(config)
}

export default useObjectOption
