/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";


/**
 * 我审批的
 * @param query
 * @returns {*}
 */
export function getItemApproverVosWithUserIdPage(query) {
    return axios({
        url: "/project/approver/page",
        method: "get",
        params: query
    });
}


/**
 * 项目审批
 * @param data
 * @returns {AxiosPromise}
 */
export function checkItem(data) {
    return axios({
        url: "/project/approver",
        method: "put",
        data: data
    });
}
