import { userInfo, loginName, logout } from "../../api/auth/login";
import { getMenuList } from "../../api/admin/user";
import * as types from "../mutation-types";
import { encryption } from '../../utils/utils'
import { constantRouterMap } from "../../router";
import {
    getToken,
    setToken,
    removeToken,
    getUserId,
    setUserId,
    removeUserId
} from "../../utils/auth";
// import { $NOT_NETWORK } from '../../utils/errorCode'
import { Message } from "element-ui";

// initial state
const state = {
    userId: getUserId(), // id
    companyId: null, // id
    userName: "", // 昵称
    avatar: "", // 头像
    token: getToken(), // 登录token
    authRules: [], // 权限列表
    permissions: [], // 权限列表
    routers: constantRouterMap // 路由列表
};

// getters
const getters = {
    userId: state => state.userId,
    companyId: state => state.companyId,
    userName: state => state.userName,
    avatar: state => state.avatar,
    token: state => state.token,
    authRules: state => state.authRules,
    permissions: state => state.permissions,
    routers: state => state.routers
};

// actions
const actions = {
    // 用户名登录
    loginName({ commit }, userInfo) {
        const user = encryption({
            data: userInfo,
            key: 'dddddddddddddddd',
            param: ['password']
        })
        // const userName = userInfo.userName ? userInfo.userName.trim() : "";
        // const pwd = userInfo.pwd ? userInfo.pwd : "";
        return new Promise((resolve, reject) => {
            loginName(user.username, user.password, user.code, user.randomStr)
                .then(response => {
                    const data = response.data || {};
                    commit(types.RECEIVE_USER_ID, data.user_id);
                    commit(types.RECEIVE_ADMIN_TOKEN, data.access_token);
                    commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    userInfo({ commit }) {
        return new Promise((resolve, reject) => {
            userInfo()
                .then(response => {
                    // if (response.code === 2) {
                    //     reject("登录失效");
                    // }
                    const data = response.data || {};

                    commit(types.RECEIVE_ADMIN_COMPANY, data.data.sysUser.companyId);
                    commit(types.RECEIVE_ADMIN_NAME, data.data.sysUser.username);
                    commit(types.RECEIVE_ADMIN_AVATAR, data.data.sysUser.avatar);
                    commit(types.RECEIVE_ADMIN_AUTH_RULES, data.data.roles);
                    commit(types.RECEIVE_ADMIN_PERMISSIONS, data.data.permissions);
                    resolve(data.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    // 登出
    loginOut({ commit }) {
        return new Promise((resolve, reject) => {
            logout()
                .then(() => {
                    commit(types.RECEIVE_USER_ID, "");
                    commit(types.RECEIVE_ADMIN_TOKEN, "");
                    commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // 前端 登出
    fedLogout({ commit }) {
        return new Promise(resolve => {
            commit(types.RECEIVE_USER_ID, "");
            commit(types.RECEIVE_ADMIN_TOKEN, "");
            commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
            resolve();
        });
    },
    /**
     * 过滤路由列表
     * @param commit
     * @param data
     * @returns {Promise}
     */
    filterRouter({ commit }) {
        //console.info(data)
        return new Promise(resolve => {
            getMenuList()
                .then(response => {
                    const accessedRouters = response.data.data;
                    if (accessedRouters && accessedRouters.length > 0) {
                        commit(types.RECEIVE_ROUTERS, accessedRouters);
                        resolve(accessedRouters);
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            // console.log(data)
            // const { accessedRouters } = data;
            // console.log(accessedRouters)
            // if (accessedRouters && accessedRouters.length > 0) {
            //     commit(types.RECEIVE_ROUTERS, accessedRouters);
            // }
        });
    }
};

// mutations
const mutations = {
    [types.RECEIVE_USER_ID](state, userId) {
        state.userId = userId;
        if (userId === "") {
            removeUserId();
        } else {
            setUserId(userId);
        }
    },
    [types.RECEIVE_ADMIN_TOKEN](state, token) {
        state.token = token;
        if (token === "") {
            removeToken();
        } else {
            setToken(token);
        }
    },
    [types.RECEIVE_ADMIN_COMPANY](state, companyId) {
        state.companyId = companyId;
    },
    [types.RECEIVE_ADMIN_NAME](state, userName) {
        state.userName = userName;
    },
    [types.RECEIVE_ADMIN_AVATAR](state, avatar) {
        state.avatar = avatar;
    },
    [types.RECEIVE_ADMIN_AUTH_RULES](state, authRules) {
        state.authRules = authRules;
    },
    [types.RECEIVE_ADMIN_PERMISSIONS](state, permissions) {
        const list = {}
        for (let i = 0; i < permissions.length; i++) {
            list[permissions[i]] = true
        }
        state.permissions = list
    },
    [types.RECEIVE_ROUTERS](state, routers) {
        const tempRm = constantRouterMap.concat(routers);
        state.routers = JSON.parse(JSON.stringify(tempRm));
        //console.log(state.routers)
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
