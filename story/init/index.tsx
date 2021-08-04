import {initialize} from '../../src/index'
import useTableOption from "./useTableOption";
import useObjectOption from "./useObjectOption";
import {useHttp} from "./useHttp";
import {useAddressConfig} from "./useAddressConfig";

initialize(() => ({
    useTableOption,
    useObjectOption,
    useHttp,
    useAddressConfig,
}))
