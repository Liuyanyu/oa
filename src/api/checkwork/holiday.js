/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 谁最懂我相关

// 列表
export function fetchList(query) {
    return axios({
        url: "/checkwork/holiday/page",
        method: "get",
        params: query
    });
}


export function addObj(data) {
    return axios({
        url: "/checkwork/holiday",
        method: "post",
        data: data
    });
}

export function putObj(data) {
    return axios({
        url: "/checkwork/holiday",
        method: "put",
        data: data
    });
}

export function delObj(id) {
    return axios({
        url: "/checkwork/holiday/" + id,
        method: "delete"
    })
}
