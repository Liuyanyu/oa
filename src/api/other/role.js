/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 列表
export function getPageList(query) {
    return axios({
        url: "/admin/role/page",
        method: "get",
        params: query
    });
}

export function deptRoleList() {
    return axios({
        url: '/admin/role/list',
        method: 'get'
    })
}



export function addRole(data) {
    return axios({
        url: "/admin/role",
        method: "post",
        data: data
    });
}

export function updateRole(data) {
    return axios({
        url: "/admin/role",
        method: "put",
        data: data
    });
}

export function deleteRole(id) {
    return axios({
        url: "/admin/role/" + id,
        method: "delete"
    })
}

export function permissionUpd(roleId, menuIds) {
    return axios({
        url: '/admin/role/menu',
        method: 'put',
        params: {
            roleId: roleId,
            menuIds: menuIds
        }
    })
}

export function fetchRoleTree(roleId) {
    return axios({
        url: '/admin/menu/tree/' + roleId,
        method: 'get'
    })
}
