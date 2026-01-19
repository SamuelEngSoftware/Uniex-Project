<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth'; 
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <nav class="w-full bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
    <RouterLink to="/" class="flex items-center gap-2">
      <div class="text-blue-600">
        <GraduationCap :size="32" />
      </div>
      <div class="flex flex-col">
        <span class="text-xl font-bold text-blue-600 leading-none">UniEx</span>
        <span class="text-xs text-gray-500 font-medium">Extensão Universitária</span>
      </div>
    </RouterLink>

    <div class="flex items-center gap-3">
      
      <template v-if="authStore.isAuthenticated">
        <span class="text-sm text-gray-600 mr-2 hidden md:inline">
          Olá, {{ authStore.user?.name }}
        </span>
        
        <RouterLink to="/dashboard" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
          Meu Painel
        </RouterLink>
        
        <button 
          @click="handleLogout"
          class="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
        >
          Sair
        </button>
      </template>

      <template v-else>
        <RouterLink to="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition">
          Entrar
        </RouterLink>
        <RouterLink to="/register" class="px-4 py-2 text-sm font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm">
          Cadastrar
        </RouterLink>
      </template>

    </div>
  </nav>
</template>