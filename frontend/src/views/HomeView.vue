<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Users } from 'lucide-vue-next' 
import AppNavbar from '../components/AppNavBar.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import Pagination from '../components/Pagination.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { formatDate } from '../utils/formatters'
import type { Course, PaginatedResponse } from '../types'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(true)
const courses = ref<Course[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 9
const isModalOpen = ref(false)
const selectedCourseId = ref('')
const modalConfig = reactive({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  confirmText: 'Confirmar',
  showCancel: true,
  action: null as (() => Promise<void> | void) | null
})

const openModal = (config: any) => {
  Object.assign(modalConfig, config)
  modalConfig.type = config.type || 'info'
  modalConfig.confirmText = config.confirmText || 'OK'
  modalConfig.showCancel = config.showCancel ?? true
  isModalOpen.value = true
}

const handleConfirm = () => {
  isModalOpen.value = false
  if (modalConfig.action) modalConfig.action()
}

const fetchCourses = async () => {
  isLoading.value = true
  try {
    const response = await api.get<PaginatedResponse<Course>>('/courses', {
        params: {
            page: currentPage.value,
            limit: limit
        }
    })
    courses.value = response.data.data 
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error("Erro ao buscar cursos:", error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (newPage: number) => {
  currentPage.value = newPage
  fetchCourses()
}

const handleSubscribeClick = (courseId: string) => {
  if (!authStore.isAuthenticated) {
    openModal({
      title: 'Login Necessário',
      message: 'Você precisa entrar na sua conta para se inscrever.',
      type: 'warning',
      confirmText: 'Fazer Login',
      action: () => router.push('/login')
    })
    return
  }

  selectedCourseId.value = courseId
  openModal({
    title: 'Confirmar Inscrição',
    message: 'Deseja garantir sua vaga neste curso?',
    confirmText: 'Sim, inscrever',
    action: performSubscription
  })
}

const performSubscription = async () => {
  try {
    await api.post('/subscribe', { courseId: selectedCourseId.value }) 
    
    setTimeout(() => {
      openModal({
        title: 'Sucesso!',
        message: 'Você está inscrito. Acesse seu painel.',
        type: 'success',
        showCancel: false,
        action: () => router.push('/dashboard')
      })
    }, 300)

  } catch (error: any) {
    setTimeout(() => {
      openModal({
        title: 'Erro',
        message: error.response?.data?.message || "Não foi possível realizar a inscrição.",
        type: 'error',
        showCancel: false
      })
    }, 300)
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppNavbar />

    <ConfirmationModal 
      :isOpen="isModalOpen"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :type="modalConfig.type"
      :confirmText="modalConfig.confirmText"
      :showCancel="modalConfig.showCancel"
      @close="isModalOpen = false"
      @confirm="handleConfirm"
    />

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      
      <div class="mb-8 border-b border-gray-200 pb-6">
           <h1 class="text-3xl font-bold text-gray-900">Cursos Disponíveis</h1>
           <p class="text-gray-500 mt-1">Encontre atividades de extensão.</p>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <div v-else>
        <div v-if="courses.length === 0" class="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 class="text-lg font-medium text-gray-900">Nenhum curso disponível no momento.</h3>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="course in courses" :key="course.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                <div class="h-2 bg-blue-600"></div>
                
                <div class="p-5 flex-grow flex flex-col">
                    <div class="flex justify-between items-start mb-3">
                        <span class="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded font-bold uppercase">Extensão</span>
                        <span class="text-xs text-gray-400">{{ course.spots }} vagas</span>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{{ course.title }}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{{ course.description }}</p>
                    
                    <div class="space-y-3 pt-4 border-t border-gray-100 mt-auto">
                        <div class="flex items-center text-sm text-gray-500 gap-2">
                            <Calendar :size="16" class="text-blue-500" />
                            <span>{{ formatDate(course.date) }}</span>
                        </div>
                        
                        <div class="flex items-center text-sm text-gray-500 gap-2">
                            <Users :size="16" class="text-blue-500" />
                            <span>{{ course.coordenador?.name }}</span>
                        </div>

                        <button 
                            @click="handleSubscribeClick(course.id)"
                            class="w-full bg-gray-900 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors mt-2"
                        >
                            Inscrever-se
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-10">
             <Pagination 
                :current-page="currentPage" 
                :total-pages="totalPages" 
                @change-page="changePage" 
            />
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-gray-200 py-6 mt-auto">
        <div class="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            &copy; {{ new Date().getFullYear() }} UniEx - Extensão Universitária. Todos os direitos reservados.
        </div>
    </footer>
  </div>
</template>