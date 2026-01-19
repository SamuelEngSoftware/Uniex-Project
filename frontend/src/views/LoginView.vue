<script setup lang="ts">
import { ref } from 'vue'
import { LogIn, AlertCircle } from 'lucide-vue-next' 
import AppNavbar from '../components/AppNavBar.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 

const router = useRouter()
const authStore = useAuthStore() 

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('') 

const handleLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value.toLowerCase(), password.value)
    router.push('/') 
    
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.message || 'Email ou senha incorretos.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-screen bg-gray-50 flex flex-col overflow-hidden">
    
    <AppNavbar />

    <div class="flex-1 flex items-center justify-center px-4">
      
      <div class="w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        
        <div class="mx-auto mb-4 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
          <LogIn :size="20" />
        </div>

        <h1 class="text-xl font-bold text-gray-900 mb-1">Entrar no UniEx</h1>
        <p class="text-sm text-gray-500 mb-6">Gerencie seus cursos e inscrições</p>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-left">
          <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0" />
          <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 text-left">
          
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
            <input 
              v-model="email"
              type="email" 
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Senha</label>
            <input 
              v-model="password"
              type="password" 
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition transform active:scale-[0.98] text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"          >
            <span v-if="isLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>

        </form>

        <p class="mt-6 text-xs text-gray-500">
          Não tem uma conta? 
          <RouterLink to="/register" class="text-blue-600 font-semibold hover:underline">
            Cadastre-se
          </RouterLink>
        </p>

      </div>
    </div>
  </div>
</template>