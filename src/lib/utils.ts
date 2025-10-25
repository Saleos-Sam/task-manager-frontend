import { TaskStatus, TaskPriority } from '@/types/task';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getStatusColor = (status: TaskStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'TODO':
      return 'default';
    case 'IN_PROGRESS':
      return 'primary';
    case 'ON_HOLD':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

export const getPriorityColor = (priority: TaskPriority): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (priority) {
    case 'LOW':
      return 'success';
    case 'MEDIUM':
      return 'info';
    case 'HIGH':
      return 'warning';
    case 'URGENT':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'ON_HOLD':
      return 'On Hold';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    case 'URGENT':
      return 'Urgent';
    default:
      return priority;
  }
};

export const formatDate = (date: string | null): string => {
  if (!date) return 'No date';
  return dayjs(date).format('MMM DD, YYYY');
};

export const formatDateTime = (date: string | null): string => {
  if (!date) return 'No date';
  return dayjs(date).format('MMM DD, YYYY HH:mm');
};

export const formatRelativeTime = (date: string | null): string => {
  if (!date) return 'No date';
  return dayjs(date).fromNow();
};

export const isOverdue = (dueDate: string | null, status: TaskStatus): boolean => {
  if (!dueDate || status === 'COMPLETED' || status === 'CANCELLED') {
    return false;
  }
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};

export const isDueToday = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return dayjs(dueDate).isSame(dayjs(), 'day');
};

export const isDueSoon = (dueDate: string | null, days: number = 3): boolean => {
  if (!dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs().add(days, 'day')) && dayjs(dueDate).isAfter(dayjs());
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateTaskId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
