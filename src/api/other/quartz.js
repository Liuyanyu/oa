/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

export function fetchList(query) {
    return axios({
        url: '/quartz/sys-job/page',
        method: 'get',
        params: query
    })
}

export function getJobLogList(query) {
    return axios({
        url: '/quartz/sys-job/job-log',
        method: 'get',
        params: query
    })
}

export function shutdownJobsRa() {
    return axios({
        url: '/quartz/sys-job/shutdown-jobs',
        method: 'post'
    })
}

export function startJobsRa() {
    return axios({
        url: '/quartz/sys-job/start-jobs',
        method: 'post'
    })
}

export function refreshJobsRa() {
    return axios({
        url: '/quartz/sys-job/refresh-jobs',
        method: 'post'
    })
}

export function startJobRa(jobId) {
    return axios({
        url: '/quartz/sys-job/start-job/' + jobId,
        method: 'post'
    })
}

export function runJobRa(jobId) {
    return axios({
        url: '/quartz/sys-job/run-job/' + jobId,
        method: 'post'
    })
}

export function shutDownJobRa(jobId) {
    return axios({
        url: '/quartz/sys-job/shutdown-job/' + jobId,
        method: 'post'
    })
}

export function addObj(obj) {
    return axios({
        url: '/quartz/sys-job',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return axios({
        url: '/quartz/sys-job/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return axios({
        url: '/quartz/sys-job/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return axios({
        url: '/quartz/sys-job',
        method: 'put',
        data: obj
    })
}

export function isValidTaskName(query) {
    return axios({
        url: '/quartz/sys-job/is-valid-task-name',
        method: 'get',
        params: query
    })
}
