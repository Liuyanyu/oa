/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 我的开票申请列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getReceiptPage(query) {
    return axios({
        url: "/apply/receipt/page",
        method: "get",
        params: query
    });
}

/**
 * 查询开票申请详情
 * @param gooutId
 * @returns {*}
 */
export function getReceiptInfo(receiptId) {
    return axios({
        url: "/apply/receipt/info/" + receiptId,
        method: "get"
    });
}

/**
 * 添加开票申请
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/apply/receipt",
        method: "post",
        data: data
    });
}

/**
 * 修改开票申请
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/apply/receipt",
        method: "put",
        data: data
    });
}

/**
 * 删除开票申请
 * @param receiptId
 * @returns {*}
 */
export function deleteObj(receiptId) {
    return axios({
        url: "/apply/receipt/" + receiptId,
        method: "delete"
    })
}


/**
 * 我的开票审批列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getReceiptApproverPage(query) {
    return axios({
        url: "/apply/receipt/approver/page",
        method: "get",
        params: query
    });
}

/**
 *
 * 根据支出申请ID查询审批信息
 * @param gooutId
 * @returns {AxiosPromise}
 */
export function getReceiptApproverList(receiptId) {
    return axios({
        url: "/apply/receipt/approver/list/" + receiptId,
        method: "get"
    });
}


/**
 * 审批开票申请
 * @param data
 * @returns {*}
 */
export function updateReceiptApprover(data) {
    return axios({
        url: "/apply/receipt/approver",
        method: "put",
        data: data
    });
}

