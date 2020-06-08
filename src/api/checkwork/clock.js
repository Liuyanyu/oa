/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 谁最懂我相关

// 列表
export function getPageList(query) {
    return axios({
        url: "/checkwork/clock/page",
        method: "get",
        params: query
    });
}

export function getAbnormalSeven() {
    return axios({
        url: "/checkwork/clock/abnormal/seven",
        method: "get"
    });
}

export function getStatistics(query) {
    return axios({
        url: "/checkwork/clock/statistics",
        method: "get",
        params: query
    });
}

export function getStatisticsUserId(query) {
    return axios({
        url: "/checkwork/clock/statistics/user",
        method: "get",
        params: query
    });
}

