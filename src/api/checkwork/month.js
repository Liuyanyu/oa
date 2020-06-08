/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 列表
export function getClockNum(query) {
    return axios({
        url: "/checkwork/month/num",
        method: "get",
        params: query
    });
}
