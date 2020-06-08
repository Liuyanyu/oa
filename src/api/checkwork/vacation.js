/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 谁最懂我相关

// 列表
export function fetchList(query) {
    return axios({
        url: "/checkwork/vacation/page",
        method: "get",
        params: query
    });
}

export function getVacationByUserId(userId) {
    return axios({
        url: "/checkwork/vacation/user/" + userId,
        method: "get"
    });
}

export function initNum(data) {
    return axios({
        url: "/checkwork/vacation/init",
        method: "post",
        data: data
    })
}


export function addObj(data) {
    return axios({
        url: "/checkwork/vacation",
        method: "post",
        data: data
    });
}

export function putObj(data) {
    return axios({
        url: "/checkwork/vacation",
        method: "put",
        data: data
    });
}

export function delObj(id) {
    return axios({
        url: "/checkwork/vacation/" + id,
        method: "delete"
    })
}
