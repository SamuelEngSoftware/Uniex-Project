<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next'; // minha logo
</script>

<template>
  <nav class="w-full bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="text-blue-600">
        <GraduationCap :size="32" />
      </div>
      <div class="flex flex-col">
        <span class="text-xl font-bold text-blue-600 leading-none">UniEx</span>
        <span class="text-xs text-gray-500 font-medium">Extensão Universitária</span>
      </div>
    </div>

    <div class="flex items-center gap-8">
      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
        <a href="#" class="hover:text-black transition">Início</a>
        <a href="#" class="flex items-center gap-1 hover:text-black transition">
           Cursos
        </a>
      </div>

      <div class="flex items-center gap-3">
        <button class="px-5 py-2 text-sm font-medium text-gray-700 hover:text-black transition">
          Entrar
        </button>
        <button class="px-5 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm">
          Cadastrar
        </button>
      </div>
    </div>
  </nav>
</template>