import request from '@/utils/request'

export const getMenuPageList = params => request.get('/admin/menu/list', { params })
export const getMenuAllList = params => request.get('/admin/menu/all-list', { params })
export const getPermissionMenuList = params => request.get('/admin/menu/permission-list', { params })
export const getRoleMenu = params => request.get('/admin/role/role-menu', { params })
export const addMenu = params => request.post('/admin/menu/save', params)
export const updateMenu = params => request.post('/admin/menu/update', params)
export const deleteMenu = params => request.post(`/admin/menu/delete/${params.id}`)
