/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

/**
 * 我的报销申请列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getInvoicePage(query) {
    return axios({
        url: "/apply/invoice/page",
        method: "get",
        params: query
    });
}
/**
 * 查询报销申请详情
 * @param invoiceId
 * @returns {*}
 */
export function getInvoiceInfo(invoiceId) {
    return axios({
        url: "/apply/invoice/info/" + invoiceId,
        method: "get"
    });
}


/**
 * 添加报销申请
 * @param data
 * @returns {*}
 */
export function addObj(data) {
    return axios({
        url: "/apply/invoice",
        method: "post",
        data: data
    });
}

/**
 * 修改报销申请
 * @param data
 * @returns {*}
 */
export function editObj(data) {
    return axios({
        url: "/apply/invoice",
        method: "put",
        data: data
    });
}

/**
 * 删除报销申请
 * @param invoiceId
 * @returns {*}
 */
export function deleteObj(invoiceId) {
    return axios({
        url: "/apply/invoice/" + invoiceId,
        method: "delete"
    })
}


/**
 * 我的报销审批列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getInvoiceApproverPage(query) {
    return axios({
        url: "/apply/invoice/approver/page",
        method: "get",
        params: query
    });
}

/**
 * 根据报销申请ID查询审批信息
 * @param invoiceId
 * @returns {AxiosPromise}
 */
export function getInvoiceApproverList(invoiceId) {
    return axios({
        url: "/apply/invoice/approver/list/" + invoiceId,
        method: "get"
    });
}

/**
 * 审批报销申请
 * @param data
 * @returns {*}
 */
export function updateInvoiceApprover(data) {
    return axios({
        url: "/apply/invoice/approver",
        method: "put",
        data: data
    });
}



