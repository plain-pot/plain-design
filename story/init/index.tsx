import {initialize} from '../../src/index'
import useTableOption from "./useTableOption";
import useObjectOption from "./useObjectOption";
import {useHttp} from "./useHttp";

initialize(() => ({
    useTableOption,
    useObjectOption,
    useHttp,
}))