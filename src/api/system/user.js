import request from '@/utils/request'

export const login = params => request.post('/login', params)
export const logout = () => request.post('/logout')
export const getInfo = params => request.get('/system/user/info', { params })
export const list = params => request.get('/system/user/list', { params })
export const add = params => request.post('/system/user/save', params)
export const update = params => request.post('/system/user/update', params)
export const updateCurrentUser = params => request.post('/system/user/update-current-user', params)
export const remove = params => request.post(`/system/user/delete/${params.id}`)
export const resetPassword = params => request.post(`/system/user/resetPassword`, params)
