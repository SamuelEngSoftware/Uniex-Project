<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UserPlus } from 'lucide-vue-next'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('participante') 
const isLoading = ref(false)

const handleRegister = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    await authStore.register(name.value, email.value, password.value, role.value)
    
    alert('deu certo criar a conta!') // antes de entregar vou tirar esses alertas feios
    router.push('/login') 
    
  } catch (error: any) {
    alert(error.response?.data?.message || 'Deu algum b.o ao tentar criar')
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
        
        <div class="mx-auto mb-4 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
          <UserPlus :size="20" />
        </div>

        <h1 class="text-xl font-bold text-gray-900 mb-1">Crie sua conta</h1>
        <p class="text-sm text-gray-500 mb-6">Junte-se ao UniEx</p>

        <form @submit.prevent="handleRegister" class="space-y-4 text-left">
          
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Nome Completo</label>
            <input 
              v-model="name"
              type="text" 
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              placeholder="Ex: João da Silva"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">Sou:</label>
            <div class="relative">
              <select 
                v-model="role"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="participante">Participante (Aluno)</option>
                <option value="coordenador">Coordenador (Professor)</option>
              </select>
              
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition transform active:scale-[0.98] text-sm mt-2 disabled:opacity-50"
          >
            {{ isLoading ? 'Criando conta...' : 'Cadastrar' }}
          </button>
        </form>

        <p class="mt-6 text-xs text-gray-500">
          Já tem uma conta? 
          <RouterLink to="/login" class="text-blue-600 font-semibold hover:underline">
            Entrar agora
          </RouterLink>
        </p>

      </div>
    </div>
  </div>
</template>