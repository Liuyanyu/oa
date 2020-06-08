/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 审批规范分页列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getStandardApplyPage(query) {
    return axios({
        url: "/standard/apply/page",
        method: "get",
        params: query
    });
}

export function getStandardApplyInfoById(id) {
    return axios({
        url: "/standard/apply/" + id,
        method: "get"
    });
}

/**
 * 添加审批规范
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/standard/apply",
        method: "post",
        data: data
    });
}

/**
 * 修改审批规范
 * @param data
 * @returns {*}
 */
export function putObj(data) {
    return axios({
        url: "/standard/apply",
        method: "put",
        data: data
    });
}

/**
 * 删除审批规范
 * @param id
 * @returns {*}
 */
export function deleteObj(id) {
    return axios({
        url: "/standard/apply/" + id,
        method: "delete"
    })
}

