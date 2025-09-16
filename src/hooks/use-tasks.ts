import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/lib/api';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskStatistics,
  BulkUpdateStatusRequest,
  TaskStatus,
  TaskPriority,
} from '@/types/task';

// Query keys
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters?: TaskFilters) => [...taskQueryKeys.lists(), filters] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskQueryKeys.details(), id] as const,
  statistics: () => [...taskQueryKeys.all, 'statistics'] as const,
  overdue: () => [...taskQueryKeys.all, 'overdue'] as const,
  dueToday: () => [...taskQueryKeys.all, 'due-today'] as const,

  dueWithin: (days: number) => [...taskQueryKeys.all, 'due-within', days] as const,
  highPriority: () => [...taskQueryKeys.all, 'high-priority'] as const,
  search: (query: string) => [...taskQueryKeys.all, 'search', query] as const,
  recent: (page: number, size: number) => [...taskQueryKeys.all, 'recent', page, size] as const,
  byStatus: (status: TaskStatus) => [...taskQueryKeys.all, 'status', status] as const,
  byPriority: (priority: TaskPriority) => [...taskQueryKeys.all, 'priority', priority] as const,
  byCategory: (category: string) => [...taskQueryKeys.all, 'category', category] as const,
  assignedTo: (email: string) => [...taskQueryKeys.all, 'assigned', email] as const,
  createdBy: (email: string) => [...taskQueryKeys.all, 'created-by', email] as const,
};

// Custom hooks
export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: taskQueryKeys.list(filters),
    queryFn: () => taskApi.getAllTasks(filters),
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: taskQueryKeys.detail(id),
    queryFn: () => taskApi.getTaskById(id),
    enabled: !!id,
  });
};

export const useFilteredTasks = (filters: TaskFilters) => {
  return useQuery({
    queryKey: taskQueryKeys.list(filters),
    queryFn: () => taskApi.filterTasks(filters),
    enabled: Object.keys(filters).length > 0,
  });
};

export const useTaskStatistics = () => {
  return useQuery({
    queryKey: taskQueryKeys.statistics(),
    queryFn: () => taskApi.getTaskStatistics(),
  });
};

export const useOverdueTasks = () => {
  return useQuery({
    queryKey: taskQueryKeys.overdue(),
    queryFn: () => taskApi.getOverdueTasks(),
  });
};

export const useTasksDueToday = () => {
  return useQuery({
    queryKey: taskQueryKeys.dueToday(),
    queryFn: () => taskApi.getTasksDueToday(),
  });
};

export const useTasksDueWithin = (days: number) => {
  return useQuery({
    queryKey: taskQueryKeys.dueWithin(days),
    queryFn: () => taskApi.getTasksDueWithin(days),
    enabled: days > 0,
  });
};

export const useHighPriorityTasks = () => {
  return useQuery({
    queryKey: taskQueryKeys.highPriority(),
    queryFn: () => taskApi.getHighPriorityTasks(),
  });
};

export const useSearchTasks = (query: string) => {
  return useQuery({
    queryKey: taskQueryKeys.search(query),
    queryFn: () => taskApi.searchTasks(query),
    enabled: query.length > 0,
  });
};

export const useRecentTasks = (page = 0, size = 5) => {
  return useQuery({
    queryKey: taskQueryKeys.recent(page, size),
    queryFn: () => taskApi.getRecentTasks(page, size),
  });
};

export const useTasksByStatus = (status: TaskStatus) => {
  return useQuery({
    queryKey: taskQueryKeys.byStatus(status),
    queryFn: () => taskApi.getTasksByStatus(status),
  });
};

export const useTasksByPriority = (priority: TaskPriority) => {
  return useQuery({
    queryKey: taskQueryKeys.byPriority(priority),
    queryFn: () => taskApi.getTasksByPriority(priority),
  });
};

export const useTasksByCategory = (category: string) => {
  return useQuery({
    queryKey: taskQueryKeys.byCategory(category),
    queryFn: () => taskApi.getTasksByCategory(category),
    enabled: !!category,
  });
};

export const useTasksAssignedTo = (email: string) => {
  return useQuery({
    queryKey: taskQueryKeys.assignedTo(email),
    queryFn: () => taskApi.getTasksAssignedTo(email),
    enabled: !!email,
  });
};

export const useTasksCreatedBy = (email: string) => {
  return useQuery({
    queryKey: taskQueryKeys.createdBy(email),
    queryFn: () => taskApi.getTasksCreatedBy(email),
    enabled: !!email,
  });
};

// Mutations
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: CreateTaskRequest) => taskApi.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: UpdateTaskRequest }) =>
      taskApi.updateTask(id, task),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskQueryKeys.detail(updatedTask.id), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
};

export const usePatchTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Partial<UpdateTaskRequest> }) =>
      taskApi.patchTask(id, task),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskQueryKeys.detail(updatedTask.id), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.completeTask(id),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskQueryKeys.detail(updatedTask.id), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
};

export const useStartTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.startTask(id),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskQueryKeys.detail(updatedTask.id), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
};

export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkUpdateStatusRequest) => taskApi.bulkUpdateStatus(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};

export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskIds: number[]) => taskApi.bulkDeleteTasks(taskIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
};
