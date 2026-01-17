import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  
  const isAuthenticated = computed(() => !!token.value)

  
  async function login(email: string, password: string) {
    try {
    
      const response = await api.post('/login', { email, password })
      
      const { token: newToken, user: newUser } = response.data

      token.value = newToken
      user.value = newUser

      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return newUser
    } catch (error) {
      throw error 
    }
  }
  async function register(name: string, email: string, password: string, role: string) {
    try {
     
      await api.post('/users', {
        name,
        email,
        password,
        role 
      })

      return true
    } catch (error) {
      throw error
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
   
  }

  
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return { 
    token, 
    user, 
    isAuthenticated, 
    login, 
    register,
    logout 
  }
})