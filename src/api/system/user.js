import request from '@/utils/request'

export const login = params => request.post('/login', params)
export const logout = () => request.post('/logout')
export const getInfo = params => request.get('/admin/user/info', { params })
export const list = params => request.get('/admin/user/list', { params })
export const add = params => request.post('/admin/user/save', params)
export const update = params => request.post('/admin/user/update', params)
export const updateCurrentUser = params => request.post('/admin/user/update-current-user', params)
export const remove = params => request.post(`/admin/user/delete/${params.id}`)
export const resetPassword = params => request.post(`/admin/user/resetPassword`, params)
