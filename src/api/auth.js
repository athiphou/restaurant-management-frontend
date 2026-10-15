import { apiClient, setAuthToken, clearAuthToken } from './client'

export function register(payload) {
  return apiClient('/register', { method: 'POST', body: payload })
}

export function login(payload) {
  const result = apiClient('/login', { method: 'POST', body: payload })
  return result.then((res) => {
    if (res?.data?.token) setAuthToken(res.data.token)
    return res
  })
}

export function sendOtp(payload) {
  return apiClient('/login/otp', { method: 'POST', body: payload })
}

export function resendOtp(payload) {
  return apiClient('/login/otp/resend', { method: 'POST', body: payload })
}

export function verifyOtp(payload) {
  const result = apiClient('/login/verify', { method: 'POST', body: payload })
  return result.then((res) => {
    if (res?.data?.token) setAuthToken(res.data.token)
    return res
  })
}

export function googleSignIn(credential) {
  return apiClient('/auth/google', { method: 'POST', body: { credential } })
}

export function logout() {
  const result = apiClient('/logout', { method: 'POST' })
  result.finally(clearAuthToken)
  return result
}

export function me() {
  return apiClient('/user')
}
