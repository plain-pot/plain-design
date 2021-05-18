import Axios from 'axios'
import {env} from "../env";

const http = (() => {
    const axios = Axios.create({
        baseURL: env.base,
    })
    axios.interceptors.response.use((resp) => {
        if ([404, 500, 403].indexOf(resp.status) > -1) {
            return resp
        } else {
            const {data} = resp
            return Object.assign(data, {_resp: resp})
        }
    })
    return axios
})();
