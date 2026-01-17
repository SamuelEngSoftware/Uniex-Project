<script setup lang="ts">
import { ref } from 'vue'
import { LogIn } from 'lucide-vue-next'
import AppNavbar from '../components/AppNavbar.vue'
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
    const user = await authStore.login(email.value, password.value)
    alert(`login deu certo, ${user.name}`) // antes de entregar vou tirar esses alertas feios
    
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.message 
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

        <form @submit.prevent="handleLogin" class="space-y-4 text-left">
          
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
            <input 
              v-model="email"
              type="email" 
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Senha</label>
            <input 
              v-model="password"
              type="password" 
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition transform active:scale-[0.98] text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"          >
            {{ isLoading ? 'Entrando...': 'Entrar'}}
          </button>

        </form>

        <p class="mt-6 text-xs text-gray-500">
          Não tem uma conta? 
          <a href="/register" class="text-blue-600 font-semibold hover:underline">Cadastre-se</a>
        </p>

      </div>
    </div>
  </div>
</template>