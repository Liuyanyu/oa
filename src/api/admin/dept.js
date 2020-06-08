/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 谁最懂我相关

// 列表
export function getList(query) {
    return axios({
        url: "/admin/dept/list",
        method: "get",
        params: query
    });
}


export function addDept(data) {
    return axios({
        url: "/admin/dept",
        method: "post",
        data: {
            deptId: data.deptId,
            name: data.deptName,
            userId: data.userId,
            sort: data.sort
        }
    });
}

export function updateDept(data) {
    return axios({
        url: "/admin/dept",
        method: "put",
        data: {
            deptId: data.deptId,
            name: data.deptName,
            userId: data.userId,
            sort: data.sort
        }
    });
}

export function deleteDept(id) {
    return axios({
        url: "/admin/dept/" + id,
        method: "delete"
    })
}
