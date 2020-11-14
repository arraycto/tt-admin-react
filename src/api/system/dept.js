import request from '@/utils/request'

export const list = params => request.get('/admin/dept/list', { params })
export const allList = params => request.get('/admin/dept/all-list', { params })
export const add = params => request.post('/admin/dept/save', params)
export const update = params => request.post('/admin/dept/update', params)
export const remove = params => request.post(`/admin/dept/delete/${params.id}`)
