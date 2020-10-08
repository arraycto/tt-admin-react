import request from '@/utils/request'

export const getMenuPageList = params => request.get('/system/menu/list', { params })
export const getMenuAllList = params => request.get('/system/menu/all-list', { params })
export const getPermissionMenuList = params => request.get('/system/menu/permission-list', { params })
export const getRoleMenu = params => request.get('/system/role/role-menu', { params })
export const addMenu = params => request.post('/system/menu/save', params)
export const updateMenu = params => request.post('/system/menu/update', params)
export const deleteMenu = params => request.post(`/system/menu/delete/${params.id}`)
