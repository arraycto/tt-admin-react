import request from '@/utils/request'

export const list = params => request.get('/admin/role/list', { params })
export const allList = params => request.get('/admin/role/all-list', { params })
export const add = params => request.post('/admin/role/save', params)
export const update = params => request.post('/admin/role/update', params)
export const remove = params => request.post(`/admin/role/delete/${params.id}`)
export const addMenuPermission = params => request.post(`/admin/role/add-menu-permission`, params)
