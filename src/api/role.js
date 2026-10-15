import { apiClient } from './client'

export const listRoles = () => apiClient('/roles')
export const getRole = (id) => apiClient(`/roles/${id}`)
export const createRole = (payload) => apiClient('/roles', { method: 'POST', body: payload })
export const updateRole = (id, payload) => apiClient(`/roles/${id}`, { method: 'PUT', body: payload })
export const deleteRole = (id) => apiClient(`/roles/${id}`, { method: 'DELETE' })

export const listUserRoles = () => apiClient('/user-roles')
export const getUserRole = (id) => apiClient(`/user-roles/${id}`)
export const assignRole = (payload) => apiClient('/user-roles', { method: 'POST', body: payload })
export const revokeRole = (id) => apiClient(`/user-roles/${id}`, { method: 'DELETE' })
