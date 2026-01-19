<script setup lang="ts">
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info'; 
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}>();

const emit = defineEmits(['close', 'confirm']);
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
          
          <div :class="[
            'p-6 text-center border-b border-gray-100',
            type === 'success' ? 'bg-green-50' : 
            type === 'error' ? 'bg-red-50' : 
            type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
          ]">
            <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
              <CheckCircle v-if="type === 'success'" class="w-8 h-8 text-green-500" />
              <AlertCircle v-else-if="type === 'error'" class="w-8 h-8 text-red-500" />
              <HelpCircle v-else class="w-8 h-8 text-blue-500" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
          </div>

          <div class="p-6 text-center">
            <p class="text-gray-600">{{ message }}</p>
          </div>

          <div class="p-6 pt-0 flex gap-3 justify-center">
            <button 
              v-if="showCancel"
              @click="$emit('close')"
              class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition focus:ring-2 focus:ring-gray-200"
            >
              {{ cancelText || 'Cancelar' }}
            </button>
            
            <button 
              @click="$emit('confirm')"
              :class="[
                'px-5 py-2.5 text-white rounded-lg font-bold shadow-md transition transform active:scale-95 focus:ring-2 focus:ring-offset-2',
                type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 
                type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 
                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              ]"
            >
              {{ confirmText || 'Confirmar' }}
            </button>
          </div>

          <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X :size="20" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>