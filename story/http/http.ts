import Axios from 'axios'
import {env} from "../env";

export const http = Axios.create({
    baseURL: env.base,
})

