export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  assignedTo: string | null;
  estimatedHours: number | null;
  completionDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate?: string;
  priority: TaskPriority;
  category: string;
  assignedTo?: string;
  estimatedHours?: number;
  createdBy: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  assignedTo?: string;
  estimatedHours?: number;
}

export interface TaskFilters {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  assignedTo?: string;
  createdBy?: string;
  createdAfter?: string;
  createdBefore?: string;
  dueAfter?: string;
  dueBefore?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface TaskStatistics {
  statusCounts: Record<TaskStatus, number>;
  priorityCounts: Record<TaskPriority, number>;
  categoryCounts: Record<string, number>;
  assigneeCounts: Record<string, number>;
  overall: {
    total: number;
    overdue: number;
    dueToday: number;
  };
}

export interface BulkUpdateStatusRequest {
  taskIds: number[];
  status: TaskStatus;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
