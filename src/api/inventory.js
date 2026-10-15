import { apiClient } from './client'

// Suppliers
export const listSuppliers = () => apiClient('/suppliers')
export const getSupplier = (id) => apiClient(`/suppliers/${id}`)
export const createSupplier = (payload) => apiClient('/suppliers', { method: 'POST', body: payload })
export const updateSupplier = (id, payload) => apiClient(`/suppliers/${id}`, { method: 'PUT', body: payload })
export const deleteSupplier = (id) => apiClient(`/suppliers/${id}`, { method: 'DELETE' })

// Ingredients
export const listIngredients = () => apiClient('/ingredients')
export const getIngredient = (id) => apiClient(`/ingredients/${id}`)
export const createIngredient = (payload) => apiClient('/ingredients', { method: 'POST', body: payload })
export const updateIngredient = (id, payload) => apiClient(`/ingredients/${id}`, { method: 'PUT', body: payload })
export const deleteIngredient = (id) => apiClient(`/ingredients/${id}`, { method: 'DELETE' })

// Inventory (stock levels)
export const listInventory = () => apiClient('/inventory')
export const getInventory = (id) => apiClient(`/inventory/${id}`)
export const createInventory = (payload) => apiClient('/inventory', { method: 'POST', body: payload })
export const updateInventory = (id, payload) => apiClient(`/inventory/${id}`, { method: 'PUT', body: payload })
export const deleteInventory = (id) => apiClient(`/inventory/${id}`, { method: 'DELETE' })

// Inventory transactions
export const listTransactions = () => apiClient('/inventory-transactions')
export const getTransaction = (id) => apiClient(`/inventory-transactions/${id}`)
export const createTransaction = (payload) => apiClient('/inventory-transactions', { method: 'POST', body: payload })
export const updateTransaction = (id, payload) => apiClient(`/inventory-transactions/${id}`, { method: 'PUT', body: payload })
export const deleteTransaction = (id) => apiClient(`/inventory-transactions/${id}`, { method: 'DELETE' })

// Recipes
export const listRecipes = () => apiClient('/recipes')
export const getRecipe = (id) => apiClient(`/recipes/${id}`)
export const createRecipe = (payload) => apiClient('/recipes', { method: 'POST', body: payload })
export const updateRecipe = (id, payload) => apiClient(`/recipes/${id}`, { method: 'PUT', body: payload })
export const deleteRecipe = (id) => apiClient(`/recipes/${id}`, { method: 'DELETE' })

// Recipe items
export const listRecipeItems = () => apiClient('/recipe-items')
export const getRecipeItem = (id) => apiClient(`/recipe-items/${id}`)
export const createRecipeItem = (payload) => apiClient('/recipe-items', { method: 'POST', body: payload })
export const updateRecipeItem = (id, payload) => apiClient(`/recipe-items/${id}`, { method: 'PUT', body: payload })
export const deleteRecipeItem = (id) => apiClient(`/recipe-items/${id}`, { method: 'DELETE' })
