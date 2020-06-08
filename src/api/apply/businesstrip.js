/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 我的出差申请列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getBussinesstripList(query) {
    return axios({
        url: "/apply/businesstrip/page",
        method: "get",
        params: query
    });
}

/**
 * 查询出差申请详情
 * @param businesstripId
 * @returns {*}
 */

export function getBusinesstripInfo(businesstripId) {
    return axios({
        url: "/apply/businesstrip/info/" + businesstripId,
        method: "get"
    });
}

/**
 * 添加出差申请
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/apply/businesstrip",
        method: "post",
        data: data
    });
}

/**
 * 修改出差申请
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/apply/businesstrip",
        method: "put",
        data: data
    });
}

/**
 * 删除出差申请
 * @param businesstripId
 * @returns {*}
 */
export function deleteObj(businesstripId) {
    return axios({
        url: "/apply/businesstrip/" + businesstripId,
        method: "delete"
    })
}

/**
 * 我的出差审批列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getBusinesstripApproverPage(query) {
    return axios({
        url: "/apply/businesstrip/approver/page",
        method: "get",
        params: query
    });
}


/**
 * 根据出差申请ID查询审批信息
 * @param businesstripId
 * @returns {AxiosPromise}
 */

export function getBusinesstripApproverList(businesstripId) {
    return axios({
        url: "/apply/businesstrip/approver/list/" + businesstripId,
        method: "get"
    });
}


/**
 * 审批出差申请
 * @param data
 * @returns {*}
 */
export function updateBusinesstripApprover(data) {
    return axios({
        url: "/apply/businesstrip/approver",
        method: "put",
        data: data
    });
}
