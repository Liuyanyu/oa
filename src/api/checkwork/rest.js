/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 谁最懂我相关

export function getRestByUserId(userId) {
    return axios({
        url: "/checkwork/rest/" + userId,
        method: "get"
    });
}
