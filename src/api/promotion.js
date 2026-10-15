import { apiClient } from './client'

export const listPromotions = () => apiClient('/promotions')
export const getPromotion = (id) => apiClient(`/promotions/${id}`)

export const createPromotion = (payload) => apiClient('/promotions', {
  method: 'POST',
  body: payload,
})

export const updatePromotion = (id, payload) => apiClient(`/promotions/${id}`, {
  method: 'PUT',
  body: payload,
})

export const deletePromotion = (id) => apiClient(`/promotions/${id}`, {
  method: 'DELETE',
})