/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 我的外出申请列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getGooutList(query) {
    return axios({
        url: "/apply/goout/page",
        method: "get",
        params: query
    });
}

/**
 * 查询外出申请详情
 * @param gooutId
 * @returns {*}
 */
export function getGooutInfo(gooutId) {
    return axios({
        url: "/apply/goout/info/" + gooutId,
        method: "get"
    });
}


/**
 * 添加外出申请
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/apply/goout",
        method: "post",
        data: data
    });
}

/**
 * 修改外出申请
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/apply/goout",
        method: "put",
        data: data
    });
}

/**
 * 删除外出申请
 * @param gooutId
 * @returns {*}
 */
export function deleteObj(gooutId) {
    return axios({
        url: "/apply/goout/" + gooutId,
        method: "delete"
    })
}

/**
 * 我的外出审批列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getGooutApproverPage(query) {
    return axios({
        url: "/apply/goout/approver/page",
        method: "get",
        params: query
    });
}

/**
 * 根据外出申请ID查询审批信息
 * @param gooutId
 * @returns {AxiosPromise}
 */
export function getGooutApproverList(gooutId) {
    return axios({
        url: "/apply/goout/approver/list/" + gooutId,
        method: "get"
    });
}

/**
 * 审批外出申请
 * @param data
 * @returns {*}
 */
export function updateGooutApprover(data) {
    return axios({
        url: "/apply/goout/approver",
        method: "put",
        data: data
    });
}

