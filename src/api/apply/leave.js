/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 我的请假申请列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getLeaveList(query) {
    return axios({
        url: "/apply/leave/page",
        method: "get",
        params: query
    });
}


/**
 * 查询请假申请详情
 * @param leaveId
 * @returns {*}
 */
export function getLeaveInfo(leaveId) {
    return axios({
        url: "/apply/leave/info/" + leaveId,
        method: "get"
    });
}

/**
 * 添加请假申请
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/apply/leave",
        method: "post",
        data: data
    });
}

/**
 * 修改请假申请
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/apply/leave",
        method: "put",
        data: data
    });
}

/**
 * 删除请假申请
 * @param leaveId
 * @returns {*}
 */
export function deleteObj(leaveId) {
    return axios({
        url: "/apply/leave/" + leaveId,
        method: "delete"
    })
}

/**
 * 我的请假审批列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getLeaveApproverPage(query) {
    return axios({
        url: "/apply/leave/approver/page",
        method: "get",
        params: query
    });
}

/**
 * 根据请假申请ID查询审批信息
 * @param leaveId
 * @returns {AxiosPromise}
 */
export function getLeaveApproverList(leaveId) {
    return axios({
        url: "/apply/leave/approver/list/" + leaveId,
        method: "get"
    });
}

/**
 * 审批请假申请
 * @param data
 * @returns {AxiosPromise}
 */
export function updateLeaveApprover(data) {
    return axios({
        url: "/apply/leave/approver",
        method: "put",
        data: data
    });
}

