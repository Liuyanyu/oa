/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 供应商分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getSupplierPage(query) {
    return axios({
        url: "/customer/supplier/page",
        method: "get",
        params: query
    });
}

/**
 * 所有
 * @param itemId
 * @returns {*}
 */
export function getSupplierAll() {
    return axios({
        url: "/customer/supplier/all",
        method: "get"
    })
}

/**
 * 添加供应商
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/customer/supplier",
        method: "post",
        data: data
    });
}

/**
 * 修改供应商
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/customer/supplier",
        method: "put",
        data: data
    });
}

/**
 * 删除供应商
 * @param supplierId
 * @returns {*}
 */
export function deleteObj(supplierId) {
    return axios({
        url: "/customer/supplier/" + supplierId,
        method: "delete"
    })
}

