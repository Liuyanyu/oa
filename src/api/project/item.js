/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 列表
export function getPageList(query) {
    return axios({
        url: "/project/item/page",
        method: "get",
        params: query
    });
}

export function getItemAll() {
    return axios({
        url: "/project/item/all",
        method: "get"
    });
}

export function addItem(data) {
    return axios({
        url: "/project/item",
        method: "post",
        data: data
    });
}

export function editItem(data) {
    return axios({
        url: "/project/item",
        method: "put",
        data: data
    });
}

export function deleteItem(itemId) {
    return axios({
        url: "/project/item/" + itemId,
        method: "delete"
    })
}
