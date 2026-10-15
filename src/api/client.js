//connect to laravel
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

let authToken = null

export function setAuthToken(token) {
  authToken = token
}

export function clearAuthToken() {
  authToken = null
}

export async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...rest } = options

  const config = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...rest,
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`
    throw new ApiError(message, response.status, data)
  }

  return data
}
