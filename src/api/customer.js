import { apiClient } from './client'

export const listCustomers = () => apiClient('/customers')
export const getCustomer = (id) => apiClient(`/customers/${id}`)
export const createCustomer = (payload) => apiClient('/customers', { method: 'POST', body: payload })
export const updateCustomer = (id, payload) => apiClient(`/customers/${id}`, { method: 'PUT', body: payload })
export const deleteCustomer = (id) => apiClient(`/customers/${id}`, { method: 'DELETE' })

export const listAddresses = (customerId) => apiClient(customerId ? `/customers/${customerId}/addresses` : '/customer-addresses')
export const getAddress = (id) => apiClient(`/customer-addresses/${id}`)
export const createAddress = (payload) => apiClient('/customer-addresses', { method: 'POST', body: payload })
export const updateAddress = (id, payload) => apiClient(`/customer-addresses/${id}`, { method: 'PUT', body: payload })
export const deleteAddress = (id) => apiClient(`/customer-addresses/${id}`, { method: 'DELETE' })
