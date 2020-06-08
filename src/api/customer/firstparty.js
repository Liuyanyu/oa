/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 公司分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getFirstPartPage(query) {
    return axios({
        url: "/customer/firstparty/page",
        method: "get",
        params: query
    });
}


/**
 * 所有
 * @param itemId
 * @returns {*}
 */
export function getFirstpartyAll() {
    return axios({
        url: "/customer/firstparty/all",
        method: "get"
    })
}

/**
 * 添加公司
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/customer/firstparty",
        method: "post",
        data: data
    });
}

/**
 * 修改公司
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/customer/firstparty",
        method: "put",
        data: data
    });
}

/**
 * 删除公司
 * @param companyId
 * @returns {*}
 */
export function deleteObj(companyId) {
    return axios({
        url: "/customer/firstparty/" + companyId,
        method: "delete"
    })
}

