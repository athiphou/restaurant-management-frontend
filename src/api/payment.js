import { apiClient } from './client'

export const listPayments = () => apiClient('/payments')
export const getPayment = (id) => apiClient(`/payments/${id}`)
export const createPayment = (payload) => apiClient('/payments', { method: 'POST', body: payload })
export const updatePayment = (id, payload) => apiClient(`/payments/${id}`, { method: 'PUT', body: payload })
export const deletePayment = (id) => apiClient(`/payments/${id}`, { method: 'DELETE' })
