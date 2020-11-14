import request from '@/utils/request'

export const list = params => request.get('/admin/log/list', { params })
export const allList = params => request.get('/admin/log/all-list', { params })
export const add = params => request.post('/admin/log/save', params)
export const update = params => request.post('/admin/log/update', params)
export const remove = params => request.post(`/admin/log/delete/${params.id}`)
