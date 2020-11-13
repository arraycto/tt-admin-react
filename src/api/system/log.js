import request from '@/utils/request'

export const list = params => request.get('/system/log/list', { params })
export const allList = params => request.get('/system/log/all-list', { params })
export const add = params => request.post('/system/log/save', params)
export const update = params => request.post('/system/log/update', params)
export const remove = params => request.post(`/system/log/delete/${params.id}`)
