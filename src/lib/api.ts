import axios, { AxiosResponse } from 'axios';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  PaginatedResponse,
  TaskStatistics,
  BulkUpdateStatusRequest,
  TaskStatus,
  TaskPriority,
} from '@/types/task';

const BASE_URL = 'http://localhost:8080/api/v1/tasks';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    // console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || 'No body');
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const taskApi = {
  // Get all tasks with pagination (only pagination and sorting, no filtering)
  getAllTasks: async (filters?: TaskFilters): Promise<PaginatedResponse<Task>> => {
    // Extract only pagination and sorting parameters
    const { page, size, sortBy, sortDir } = filters || {};
    const params = { page, size, sortBy, sortDir };
    
    const response: AxiosResponse<any> = await apiClient.get('', { params });
    
    // Map snake_case response to camelCase
    return {
      content: response.data.content,
      totalElements: response.data.total_elements,
      totalPages: response.data.total_pages,
      number: response.data.number,
      size: response.data.size,
      first: response.data.first,
      last: response.data.last,
    };
  },

  // Get task by ID
  getTaskById: async (id: number): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.get(`${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.post('', task);
    return response.data;
  },

  // Update task
  updateTask: async (id: number, task: UpdateTaskRequest): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.put(`${id}`, task);
    return response.data;
  },

  // Partial update task
  patchTask: async (id: number, task: Partial<UpdateTaskRequest>): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.patch(`${id}`, task);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`${id}`);
  },

  // Mark task as completed
  completeTask: async (id: number): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.patch(`${id}/complete`);
    return response.data;
  },

  // Start task (mark as in progress)
  startTask: async (id: number): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.patch(`${id}/start`);
    return response.data;
  },

  // Advanced filtering
  filterTasks: async (filters: TaskFilters): Promise<PaginatedResponse<Task>> => {
    const response: AxiosResponse<any> = await apiClient.get(
      '/filter', 
      { params: filters }
    );
    
    // Map snake_case response to camelCase
    return {
      content: response.data.content,
      totalElements: response.data.total_elements,
      totalPages: response.data.total_pages,
      number: response.data.number,
      size: response.data.size,
      first: response.data.first,
      last: response.data.last,
    };
  },

  // Get overdue tasks
  getOverdueTasks: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get('/overdue');
    return response.data;
  },

  // Get tasks due today
  getTasksDueToday: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get('/due-today');
    return response.data;
  },

  // Get tasks due within N days
  getTasksDueWithin: async (days: number): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get('/due-within', {
      params: { days }
    });
    return response.data;
  },

  // Get high priority pending tasks
  getHighPriorityTasks: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get('/high-priority');
    return response.data;
  },

  // Search tasks using filter endpoint
  searchTasks: async (query: string): Promise<PaginatedResponse<Task>> => {
    const response: AxiosResponse<any> = await apiClient.get('/filter', {
      params: { searchTerm: query }
    });
    
    // Map snake_case response to camelCase
    return {
      content: response.data.content,
      totalElements: response.data.total_elements,
      totalPages: response.data.total_pages,
      number: response.data.number,
      size: response.data.size,
      first: response.data.first,
      last: response.data.last,
    };
  },

  // Get recently updated tasks
  getRecentTasks: async (page = 0, size = 5): Promise<PaginatedResponse<Task>> => {
    const response: AxiosResponse<any> = await apiClient.get('/recent', {
      params: { page, size }
    });
    
    // Map snake_case response to camelCase
    return {
      content: response.data.content,
      totalElements: response.data.total_elements,
      totalPages: response.data.total_pages,
      number: response.data.number,
      size: response.data.size,
      first: response.data.first,
      last: response.data.last,
    };
  },

  // Get tasks by status
  getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get(`status/${status}`);
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (priority: TaskPriority): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get(`priority/${priority}`);
    return response.data;
  },

  // Get tasks by category
  getTasksByCategory: async (category: string): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get(`category/${encodeURIComponent(category)}`);
    return response.data;
  },

  // Get tasks assigned to user
  getTasksAssignedTo: async (email: string): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get(`assigned/${encodeURIComponent(email)}`);
    return response.data;
  },

  // Get tasks created by user
  getTasksCreatedBy: async (email: string): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get(`created-by/${encodeURIComponent(email)}`);
    return response.data;
  },

  // Get task statistics
  getTaskStatistics: async (): Promise<TaskStatistics> => {
    const response: AxiosResponse<TaskStatistics> = await apiClient.get('/statistics');
    return response.data;
  },

  // Bulk update status
  bulkUpdateStatus: async (request: BulkUpdateStatusRequest): Promise<void> => {
    await apiClient.post('/bulk-update-status', request);
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (taskIds: number[]): Promise<void> => {
    await apiClient.delete('/bulk-delete', { data: taskIds });
  },
};

export default taskApi;
