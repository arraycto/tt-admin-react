import request from '@/utils/request'

export const list = params => request.get('/system/dept/list', { params })
export const allList = params => request.get('/system/dept/all-list', { params })
export const add = params => request.post('/system/dept/save', params)
export const update = params => request.post('/system/dept/update', params)
export const remove = params => request.post(`/system/dept/delete/${params.id}`)
