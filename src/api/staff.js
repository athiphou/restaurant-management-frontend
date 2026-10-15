import { apiClient } from './client'

export const listPositions = () => apiClient('/staff-positions')
export const getPosition = (id) => apiClient(`/staff-positions/${id}`)
export const createPosition = (payload) => apiClient('/staff-positions', { method: 'POST', body: payload })
export const updatePosition = (id, payload) => apiClient(`/staff-positions/${id}`, { method: 'PUT', body: payload })
export const deletePosition = (id) => apiClient(`/staff-positions/${id}`, { method: 'DELETE' })

export const listEmployees = () => apiClient('/employees')
export const getEmployee = (id) => apiClient(`/employees/${id}`)
export const createEmployee = (payload) => apiClient('/employees', { method: 'POST', body: payload })
export const updateEmployee = (id, payload) => apiClient(`/employees/${id}`, { method: 'PUT', body: payload })
export const deleteEmployee = (id) => apiClient(`/employees/${id}`, { method: 'DELETE' })

export const listDrivers = () => apiClient('/delivery-drivers')
export const getDriver = (id) => apiClient(`/delivery-drivers/${id}`)
export const createDriver = (payload) => apiClient('/delivery-drivers', { method: 'POST', body: payload })
export const updateDriver = (id, payload) => apiClient(`/delivery-drivers/${id}`, { method: 'PUT', body: payload })
export const deleteDriver = (id) => apiClient(`/delivery-drivers/${id}`, { method: 'DELETE' })
