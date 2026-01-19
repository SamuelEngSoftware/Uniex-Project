<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'change-page', page: number): void
}>()
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
    
    <button 
      @click="emit('change-page', currentPage - 1)" 
      :disabled="currentPage === 1"
      class="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
    >
      <ChevronLeft :size="16" /> Anterior
    </button>
    
    <span class="text-sm text-gray-600 font-medium">
      Página {{ currentPage }} de {{ totalPages }}
    </span>
    
    <button 
      @click="emit('change-page', currentPage + 1)" 
      :disabled="currentPage === totalPages"
      class="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
    >
      Próximo <ChevronRight :size="16" />
    </button>

  </div>
</template>