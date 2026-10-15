import { apiClient } from './client'

// Restaurants
export const listRestaurants = () => apiClient('/restaurants')
export const getRestaurant = (id) => apiClient(`/restaurants/${id}`)
export const createRestaurant = (payload) => apiClient('/restaurants', {
  method: 'POST',
  body: payload,
})
export const updateRestaurant = (id, payload) => apiClient(`/restaurants/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteRestaurant = (id) => apiClient(`/restaurants/${id}`, {
  method: 'DELETE',
})

// Restaurant Branches
export const listRestaurantBranches = () => apiClient('/restaurant-branches')
export const getRestaurantBranch = (id) => apiClient(`/restaurant-branches/${id}`)
export const createRestaurantBranch = (payload) => apiClient('/restaurant-branches', {
  method: 'POST',
  body: payload,
})
export const updateRestaurantBranch = (id, payload) => apiClient(`/restaurant-branches/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteRestaurantBranch = (id) => apiClient(`/restaurant-branches/${id}`, {
  method: 'DELETE',
})

// Restaurant Tables
export const listRestaurantTables = () => apiClient('/restaurant-tables')
export const getRestaurantTable = (id) => apiClient(`/restaurant-tables/${id}`)
export const createRestaurantTable = (payload) => apiClient('/restaurant-tables', {
  method: 'POST',
  body: payload,
})
export const updateRestaurantTable = (id, payload) => apiClient(`/restaurant-tables/${id}`, {
  method: 'PUT',
  body: payload,
})
export const deleteRestaurantTable = (id) => apiClient(`/restaurant-tables/${id}`, {
  method: 'DELETE',
})