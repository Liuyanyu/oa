/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";


/**
 * 我负责的
 * @param query
 * @returns {*}
 */
export function getItemAdminVosWithUserIdPage(query) {
    return axios({
        url: "/project/team/admin",
        method: "get",
        params: query
    });
}

/**
 * 我参与的 分页
 * @param query
 * @returns {*}
 */
export function getItemPartVosWithUserIdPage(query) {
    return axios({
        url: "/project/team/part",
        method: "get",
        params: query
    });
}


export function getItemVosWithUserId(userId) {
    return axios({
        url: "/project/team/" + userId,
        method: "get"
    });
}


export function getItemVosWithItemId(itemId) {
    return axios({
        url: "/project/team/item/" + itemId,
        method: "get"
    });
}
