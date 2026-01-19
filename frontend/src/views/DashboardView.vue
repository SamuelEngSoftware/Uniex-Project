<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import AppNavbar from '../components/AppNavBar.vue'
import CreateCourseModal from '../components/CreateCourseModal.vue'
import Pagination from '../components/Pagination.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { Calendar, Users, Plus, BookOpen, Briefcase, Pencil, Trash2, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()

const isCoordinator = computed(() => {
  const role = authStore.user?.role
  return role === 'coordenador' || role === 'admin'
})

const mySubscriptions = ref<any[]>([])
const managedCourses = ref<any[]>([])
const isLoading = ref(true)
const showCreateModal = ref(false)
const courseToEdit = ref<any>(null) 

const currentPage = ref(1)
const totalPages = ref(1)
const limit = 6 

const isModalOpen = ref(false)
const modalConfig = reactive({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  confirmText: 'Confirmar',
  showCancel: true,
  action: null as (() => Promise<void> | void) | null
})

const openModal = (config: any) => {
  modalConfig.title = config.title
  modalConfig.message = config.message
  modalConfig.type = config.type || 'info'
  modalConfig.confirmText = config.confirmText || 'Confirmar'
  modalConfig.showCancel = config.showCancel ?? true
  modalConfig.action = config.action
  isModalOpen.value = true
}

const handleConfirm = async () => {
  isModalOpen.value = false
  if (modalConfig.action) {
    await modalConfig.action()
  }
}

onMounted(async () => {
  await refreshData()
})

const refreshData = async () => {
  isLoading.value = true
  await Promise.all([fetchMySubscriptions(), fetchManagedCourses()])
  isLoading.value = false
}

const handleCourseCreated = async () => {
  await fetchManagedCourses()
}

const changePage = (newPage: number) => {
  currentPage.value = newPage
  fetchManagedCourses()
}

const openCreateModal = () => {
    courseToEdit.value = null
    showCreateModal.value = true
}

const editCourse = (course: any) => {
    courseToEdit.value = course 
    showCreateModal.value = true 
}

const deleteCourse = (courseId: string) => {
  openModal({
    title: 'Excluir Curso',
    message: 'Tem certeza que deseja excluir este curso permanentemente? Esta ação não pode ser desfeita.',
    type: 'error',
    confirmText: 'Sim, Excluir',
    action: async () => {
        try {
            await api.delete(`/courses/${courseId}`);
            await fetchManagedCourses();
            
            setTimeout(() => {
                openModal({
                    title: 'Sucesso',
                    message: 'O curso foi excluído corretamente.',
                    type: 'success',
                    showCancel: false,
                    confirmText: 'OK'
                })
            }, 300)
        } catch (error) {
            console.error(error);
            setTimeout(() => {
                openModal({ title: 'Erro', message: 'Não foi possível excluir o curso.', type: 'error', showCancel: false })
            }, 300)
        }
    }
  })
}

const leaveCourse = (subscriptionId: string) => {
  openModal({
    title: 'Cancelar Inscrição',
    message: 'Você tem certeza que deseja sair deste curso? Sua vaga será liberada.',
    type: 'warning',
    confirmText: 'Sim, Sair',
    action: async () => {
        try {
            await api.delete(`/subscriptions/${subscriptionId}`); 
            await fetchMySubscriptions();
            
            setTimeout(() => {
                openModal({
                    title: 'Inscrição Cancelada',
                    message: 'Você saiu do curso com sucesso.',
                    type: 'success',
                    showCancel: false,
                    confirmText: 'OK'
                })
            }, 300)
        } catch (error) {
            console.error(error);
            setTimeout(() => {
                openModal({ title: 'Erro', message: 'Erro ao sair do curso.', type: 'error', showCancel: false })
            }, 300)
        }
    }
  })
}

const fetchMySubscriptions = async () => {
  try {
    const response = await api.get('/my-courses') 
    mySubscriptions.value = response.data 
  } catch (error) { console.error(error) }
}

const fetchManagedCourses = async () => {
  if (!isCoordinator.value) return

  try {
    const response = await api.get('/my-dashboard', {
        params: { page: currentPage.value, limit: limit }
    })
    managedCourses.value = response.data.data 
    totalPages.value = response.data.totalPages
  } catch (error) { console.error(error) }
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR')
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavbar />

    <CreateCourseModal 
      :isOpen="showCreateModal"
      :courseToEdit="courseToEdit"
      @close="showCreateModal = false"
      @success="handleCourseCreated"
    />

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

    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Meu Painel</h1>
          <p class="text-gray-500 mt-1">
            Olá, {{ authStore.user?.name }} 
            
            <span 
                v-if="authStore.user?.role === 'admin'" 
                class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
                Admin
            </span>

            <span 
                v-else-if="authStore.user?.role === 'coordenador'" 
                class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
                Coordenador
            </span>
          </p>
        </div>

        <button 
          v-if="isCoordinator"
          @click="openCreateModal"
          class="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
        >
          <Plus :size="20" />
          Novo Curso
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      <section v-if="isCoordinator">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
          <Briefcase class="text-blue-600" :size="24" />
          Gerenciar Meus Cursos
        </h2>
        
        <div v-if="managedCourses.length === 0 && !isLoading" class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center border-dashed">
          <p class="text-gray-500 mb-2">Você ainda não criou nenhum curso.</p>
          <button @click="openCreateModal" class="text-blue-600 font-semibold text-sm hover:underline">Criar agora</button>
        </div>

        <div v-else>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="course in managedCourses" :key="course.id" class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition relative group">
                    
                    <div class="absolute top-3 right-3 flex items-center gap-2 z-10">
                        <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">Gestor</span>
                        
                        <button @click.stop="editCourse(course)" class="p-1.5 bg-white text-gray-500 hover:text-blue-600 border border-gray-200 rounded hover:border-blue-400 transition shadow-sm" title="Editar">
                            <Pencil :size="14" />
                        </button>

                        <button @click.stop="deleteCourse(course.id)" class="p-1.5 bg-white text-gray-500 hover:text-red-600 border border-gray-200 rounded hover:border-red-400 transition shadow-sm" title="Excluir">
                            <Trash2 :size="14" />
                        </button>
                    </div>

                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-2 pr-16">{{ course.title }}</h3>
                        <p class="text-gray-600 text-sm line-clamp-2 mb-4">{{ course.description }}</p>
                        <div class="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4">
                            <div class="flex items-center gap-1.5"><Calendar :size="16" class="text-blue-500"/> {{ formatDate(course.date) }}</div>
                            <div class="flex items-center gap-1.5"><Users :size="16" class="text-blue-500"/> {{ course.spots }} Vagas</div>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination 
                :current-page="currentPage" 
                :total-pages="totalPages" 
                @change-page="changePage" 
            />
        </div>
      </section>

      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-green-500 pl-3">
          <BookOpen class="text-green-600" :size="24" />
          Minhas Inscrições
        </h2>

        <div v-if="mySubscriptions.length === 0 && !isLoading" class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p class="text-gray-500 mb-4">Nenhuma inscrição ativa.</p>
          <RouterLink to="/" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Procurar Cursos</RouterLink>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="sub in mySubscriptions" :key="sub.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative group">
            
            <div class="absolute top-3 right-3 z-10">
                 <button 
                    @click.stop="leaveCourse(sub.id)"
                    class="flex items-center gap-1 px-2 py-1 bg-white text-gray-500 hover:text-red-600 border border-gray-200 rounded text-xs font-bold hover:border-red-300 transition shadow-sm"
                    title="Cancelar Inscrição"
                 >
                    <LogOut :size="12" /> Sair
                 </button>
            </div>

            <div class="p-6">
              <div class="mb-4"><span class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Aluno</span></div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ sub.course.title }}</h3>
              <p class="text-gray-600 text-sm line-clamp-2 mb-4">{{ sub.course.description }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4">
                <div class="flex items-center gap-1.5"><Calendar :size="16" class="text-green-600"/> {{ formatDate(sub.course.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>