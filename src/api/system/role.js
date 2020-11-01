import request from '@/utils/request'

export const list = params => request.get('/system/role/list', { params })
export const allList = params => request.get('/system/role/all-list', { params })
export const add = params => request.post('/system/role/save', params)
export const update = params => request.post('/system/role/update', params)
export const remove = params => request.post(`/system/role/delete/${params.id}`)
export const addMenuPermission = params => request.post(`/system/role/add-menu-permission`, params)
