import request from '@/utils/request'

export const login = params => request.post('/login', params)
export const logout = () => request.post('/logout')
export const getInfo = params => request.get('/system/user/info', { params })
export const getUserList = params => request.get('/system/user/list', { params })
export const addUser = params => request.post('/system/user/save', params)
export const updateUser = params => request.post('/system/user/update', params)
export const updateCurrentUser = params => request.post('/system/user/update-current-user', params)
export const deleteUser = params => request.post(`/system/user/delete/${params.id}`)
export const resetPassword = params => request.post(`/system/user/resetPassword`, params)
