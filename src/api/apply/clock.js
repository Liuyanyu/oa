/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";


/**
 * 我的未打卡申请列表
 * @param query
 * @returns {*}
 */
export function getClockList(query) {
    return axios({
        url: "/apply/clock/page",
        method: "get",
        params: query
    });
}


/**
 * 查询未打卡申请详情
 * @param gooutId
 * @returns {*}
 */
export function getClockInfo(clockId) {
    return axios({
        url: "/apply/clock/info/" + clockId,
        method: "get"
    });
}


/**
 * 添加未打卡申请
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/apply/clock",
        method: "post",
        data: data
    });
}
/**
 * 修改未打卡申请
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/apply/clock",
        method: "put",
        data: data
    });
}
/**
 * 删除未打卡申请
 * @param clockId
 * @returns {*}
 */
export function deleteObj(clockId) {
    return axios({
        url: "/apply/clock/" + clockId,
        method: "delete"
    })
}

/**
 * 我的未打卡审批列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getClockApproverPage(query) {
    return axios({
        url: "/apply/clock/approver/page",
        method: "get",
        params: query
    });
}

/**
 *
 * 根据未打卡申请ID查询审批信息
 * @param gooutId
 * @returns {AxiosPromise}
 */
export function getClockApproverList(clockId) {
    return axios({
        url: "/apply/clock/approver/list/" + clockId,
        method: "get"
    });
}

/**
 * 审批未打卡申请
 * @param data
 * @returns {AxiosPromise}
 */
export function updateClockApprover(data) {
    return axios({
        url: "/apply/clock/approver",
        method: "put",
        data: data
    });
}

