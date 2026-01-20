export interface User {
  id: string;
  name: string;
  email: string;
  role: 'participante' | 'coordenador' | 'admin';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  date: string; 
  spots: number;
  coordenador?: User;
}

export interface Subscription {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  subscribedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}