import request from '@/utils/request'

export const list = params => request.get('/system/feVersion/list', { params })
export const allList = params => request.get('/system/feVersion/all-list', { params })
export const add = params => request.post('/system/feVersion/save', params)
export const update = params => request.post('/system/feVersion/update', params)
export const remove = params => request.post(`/system/feVersion/delete/${params.id}`)
