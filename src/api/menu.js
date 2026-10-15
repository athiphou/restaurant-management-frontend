import { apiClient } from './client'

// Categories
export const listFoodCategories = () => apiClient('/food-categories')
export const getFoodCategory = (id) => apiClient(`/food-categories/${id}`)
export const createFoodCategory = (payload) => apiClient('/food-categories', { method: 'POST', body: payload })
export const updateFoodCategory = (id, payload) => apiClient(`/food-categories/${id}`, { method: 'PUT', body: payload })
export const deleteFoodCategory = (id) => apiClient(`/food-categories/${id}`, { method: 'DELETE' })
export const getCategoryFoods = (id) => apiClient(`/food-categories/${id}/foods`)
export const toggleCategoryActive = (id) => apiClient(`/food-categories/${id}/toggle-active`, { method: 'PATCH' })

// Foods
export const listFoods = () => apiClient('/foods')
export const getFood = (id) => apiClient(`/foods/${id}`)
export const getFoodFull = (id) => apiClient(`/foods/${id}/full`)
export const createFood = (payload) => apiClient('/foods', { method: 'POST', body: payload })
export const updateFood = (id, payload) => apiClient(`/foods/${id}`, { method: 'PUT', body: payload })
export const deleteFood = (id) => apiClient(`/foods/${id}`, { method: 'DELETE' })
export const getFoodVariants = (id) => apiClient(`/foods/${id}/variants`)
export const getFoodAddons = (id) => apiClient(`/foods/${id}/addons`)
export const toggleFoodAvailability = (id) => apiClient(`/foods/${id}/toggle-availability`, { method: 'PATCH' })

// Menu tree (categories → foods → variants + addons with items)
export const getMenuTree = () => apiClient('/menu/tree')

// Variants
export const listVariants = () => apiClient('/food-variants')
export const createVariant = (payload) => apiClient('/food-variants', { method: 'POST', body: payload })
export const updateVariant = (id, payload) => apiClient(`/food-variants/${id}`, { method: 'PUT', body: payload })
export const deleteVariant = (id) => apiClient(`/food-variants/${id}`, { method: 'DELETE' })
export const toggleVariantAvailability = (id) => apiClient(`/food-variants/${id}/toggle-availability`, { method: 'PATCH' })

// Add-ons
export const listAddons = () => apiClient('/food-addons')
export const getAddon = (id) => apiClient(`/food-addons/${id}`)
export const createAddon = (payload) => apiClient('/food-addons', { method: 'POST', body: payload })
export const updateAddon = (id, payload) => apiClient(`/food-addons/${id}`, { method: 'PUT', body: payload })
export const deleteAddon = (id) => apiClient(`/food-addons/${id}`, { method: 'DELETE' })
export const getAddonItems = (id) => apiClient(`/food-addons/${id}/items`)
export const toggleAddonAvailability = (id) => apiClient(`/food-addons/${id}/toggle-availability`, { method: 'PATCH' })

// Add-on items
export const listAddonItems = () => apiClient('/food-addon-items')
export const createAddonItem = (payload) => apiClient('/food-addon-items', { method: 'POST', body: payload })
export const updateAddonItem = (id, payload) => apiClient(`/food-addon-items/${id}`, { method: 'PUT', body: payload })
export const deleteAddonItem = (id) => apiClient(`/food-addon-items/${id}`, { method: 'DELETE' })
export const toggleAddonItemAvailability = (id) => apiClient(`/food-addon-items/${id}/toggle-availability`, { method: 'PATCH' })