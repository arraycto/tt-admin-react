import request from '@/utils/request'

export const list = params => request.get('/admin/feVersion/list', { params })
export const allList = params => request.get('/admin/feVersion/all-list', { params })
export const add = params => request.post('/admin/feVersion/save', params)
export const update = params => request.post('/admin/feVersion/update', params)
export const remove = params => request.post(`/admin/feVersion/delete/${params.id}`)
