import { apiClient } from './client'

// Orders
export const listOrders = () => apiClient('/orders')
export const getOrder = (id) => apiClient(`/orders/${id}`)
export const createOrder = (payload) => apiClient('/orders', {
  method: 'POST',
  body: payload,
})
export const updateOrder = (id, payload) => apiClient(`/orders/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteOrder = (id) => apiClient(`/orders/${id}`, {
  method: 'DELETE',
})

// Order Items
export const listOrderItems = () => apiClient('/order-items')
export const getOrderItem = (id) => apiClient(`/order-items/${id}`)
export const createOrderItem = (payload) => apiClient('/order-items', {
  method: 'POST',
  body: payload,
})
export const updateOrderItem = (id, payload) => apiClient(`/order-items/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteOrderItem = (id) => apiClient(`/order-items/${id}`, {
  method: 'DELETE',
})

// Order Item Addons
export const listOrderItemAddons = () => apiClient('/order-item-addons')
export const getOrderItemAddon = (id) => apiClient(`/order-item-addons/${id}`)
export const createOrderItemAddon = (payload) => apiClient('/order-item-addons', {
  method: 'POST',
  body: payload,
})
export const updateOrderItemAddon = (id, payload) => apiClient(`/order-item-addons/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteOrderItemAddon = (id) => apiClient(`/order-item-addons/${id}`, {
  method: 'DELETE',
})

// Deliveries
export const listDeliveries = () => apiClient('/deliveries')
export const getDelivery = (id) => apiClient(`/deliveries/${id}`)
export const createDelivery = (payload) => apiClient('/deliveries', {
  method: 'POST',
  body: payload,
})
export const updateDelivery = (id, payload) => apiClient(`/deliveries/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteDelivery = (id) => apiClient(`/deliveries/${id}`, {
  method: 'DELETE',
})

// Order Status History
export const listOrderStatusHistory = () => apiClient('/order-status-history')
export const getOrderStatusHistory = (id) => apiClient(`/order-status-history/${id}`)
export const createOrderStatusHistory = (payload) => apiClient('/order-status-history', {
  method: 'POST',
  body: payload,
})
export const updateOrderStatusHistory = (id, payload) => apiClient(`/order-status-history/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteOrderStatusHistory = (id) => apiClient(`/order-status-history/${id}`, {
  method: 'DELETE',
})