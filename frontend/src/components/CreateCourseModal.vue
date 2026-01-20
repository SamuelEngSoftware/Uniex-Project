<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import api from '../services/api'
import type { Course } from '../types'

const props = defineProps<{
  isOpen: boolean
  courseToEdit?: Course | null 
}>()

const emit = defineEmits(['close', 'success'])

const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  title: '',
  description: '',
  date: '',
  spots: 0
})

const isEditing = computed(() => !!props.courseToEdit)

watch(
  () => [props.isOpen, props.courseToEdit],
  ([isOpen, course]) => {
    if (isOpen) {
      const currentCourse = course as Course | null | undefined;
      
      if (currentCourse) {
        form.title = currentCourse.title
        form.description = currentCourse.description
        form.spots = currentCourse.spots
        
        if (currentCourse.date) {
            const dateObj = new Date(currentCourse.date);
            form.date = dateObj.toISOString().split('T')[0] || '';
        }
      } else {
        form.title = ''
        form.description = ''
        form.date = ''
        form.spots = 0
      }
      errorMessage.value = ''
    }
  }
)

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    if (isEditing.value && props.courseToEdit) {
        await api.put(`/courses/${props.courseToEdit.id}`, {
            title: form.title,
            description: form.description,
            date: form.date, 
            spots: Number(form.spots)
        })
    } else {
        await api.post('/courses', {
            title: form.title,
            description: form.description,
            date: form.date,
            spots: Number(form.spots)
        })
    }
    emit('success') 
    emit('close')   
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.message || 'Erro ao salvar o curso.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 class="text-xl font-bold text-gray-800">
                {{ isEditing ? 'Editar Curso' : 'Novo Curso' }}
            </h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-200">
              <X :size="20" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            
            <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {{ errorMessage }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título do Curso</label>
                <input v-model="form.title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ex: Introdução ao React" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea v-model="form.description" required rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Descreva o conteúdo do curso..."></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                  <input v-model="form.date" type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Vagas Totais</label>
                  <input v-model="form.spots" type="number" min="1" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                </div>
              </div>

              <div class="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" @click="$emit('close')" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="isLoading" class="animate-spin" :size="18" />
                  {{ isEditing ? 'Salvar Alterações' : 'Criar Curso' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>