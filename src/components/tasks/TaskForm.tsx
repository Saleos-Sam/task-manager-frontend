'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority } from '@/types/task';
import { useCreateTask, useUpdateTask, useTask } from '@/hooks/use-tasks';
import { getStatusLabel, getPriorityLabel } from '@/lib/utils';

// Task Categories
const TASK_CATEGORIES = [
  'Development',
  'Testing',
  'Bug Fix',
  'Documentation',
  'DevOps',
  'Security',
  'Database',
  'Frontend',
  'Mobile',
  'Design',
  'Research',
  'Maintenance',
  'Training',
  'Process',
  'Analysis',
  'Setup',
  'Accessibility'
] as const;

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(255, 'Title must be less than 255 characters'),
  description: yup.string().max(1000, 'Description must be less than 1000 characters'),
  dueDate: yup.date().nullable(),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  category: yup.string().max(100, 'Category must be less than 100 characters'),
  assignedTo: yup.string().email('Invalid email format').nullable(),
  estimatedHours: yup.number().nullable().min(0, 'Estimated hours must be positive'),
  createdBy: yup.string().email('Invalid email format').required('Created by is required'),
});

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Dayjs | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  assignedTo: string;
  estimatedHours: number | null;
  createdBy: string;
}

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  taskId?: number | null;
  initialData?: Partial<TaskFormData>;
  mode?: 'create' | 'edit';
}

const defaultValues: TaskFormData = {
  title: '',
  description: '',
  dueDate: null,
  status: 'TODO',
  priority: 'MEDIUM',
  category: '',
  assignedTo: '',
  estimatedHours: null,
  createdBy: 'user@example.com', // This should come from auth context
};

export default function TaskForm({ 
  open, 
  onClose, 
  taskId = null, 
  initialData = {}, 
  mode = 'create' 
}: TaskFormProps) {
  const isEdit = mode === 'edit' && taskId;
  
  const { data: existingTask, isLoading: isLoadingTask } = useTask(taskId || 0);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  // Memoize default values to prevent unnecessary re-renders
  const memoizedDefaultValues = React.useMemo(() => ({
    ...defaultValues,
    ...initialData,
  }), [initialData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: memoizedDefaultValues,
  });

  // Reset form when task data is loaded or dialog opens
  useEffect(() => {
    if (!open) return; // Don't reset if dialog is not open
    
    if (isEdit && existingTask && !isLoadingTask) {
      // Handle API response field mapping (snake_case to camelCase)
      const taskData = {
        ...existingTask,
        dueDate: (existingTask as any).due_date || existingTask.dueDate,
        createdAt: (existingTask as any).created_at || existingTask.createdAt,
        updatedAt: (existingTask as any).updated_at || existingTask.updatedAt,
        createdBy: (existingTask as any).created_by || existingTask.createdBy,
        assignedTo: (existingTask as any).assigned_to || existingTask.assignedTo,
        estimatedHours: (existingTask as any).estimated_hours || existingTask.estimatedHours,
      };

      reset({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate ? dayjs(taskData.dueDate) : null,
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        assignedTo: taskData.assignedTo || '',
        estimatedHours: taskData.estimatedHours,
        createdBy: taskData.createdBy,
      });
    }
  }, [open, isEdit, existingTask, isLoadingTask]); // Removed initialData from dependencies

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Format the due date properly
      let formattedDueDate: string | undefined;
      if (data.dueDate) {
        // If it's a Dayjs object, use format method
        if (data.dueDate && typeof data.dueDate.format === 'function') {
          formattedDueDate = data.dueDate.format('YYYY-MM-DD');
        } else {
          // If it's a Date object or string, convert to dayjs first
          formattedDueDate = dayjs(data.dueDate).format('YYYY-MM-DD');
        }
      }

      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: formattedDueDate,
        status: data.status,
        priority: data.priority,
        category: data.category || undefined,
        assignedTo: data.assignedTo || undefined,
        estimatedHours: data.estimatedHours || undefined,
        createdBy: data.createdBy,
      };

      if (isEdit && taskId) {
        await updateTaskMutation.mutateAsync({
          id: taskId,
          task: taskData as UpdateTaskRequest,
        });
      } else {
        await createTaskMutation.mutateAsync(taskData as CreateTaskRequest);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const watchedStatus = watch('status');
  const watchedPriority = watch('priority');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <IconButton onClick={handleClose} disabled={isSubmitting}>
            <Close />
          </IconButton>
        </DialogTitle>

        {(isLoadingTask && isEdit) ? (
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          </DialogContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Title"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>

                {/* Status and Priority */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          {...field}
                          label="Status"
                          disabled={isSubmitting}
                        >
                          {(['TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'] as TaskStatus[]).map(status => (
                            <MenuItem key={status} value={status}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getStatusLabel(status)}
                                {status === watchedStatus && (
                                  <Chip size="small" label="Current" color="primary" />
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.status && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.status.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.priority}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          {...field}
                          label="Priority"
                          disabled={isSubmitting}
                        >
                          {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TaskPriority[]).map(priority => (
                            <MenuItem key={priority} value={priority}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getPriorityLabel(priority)}
                                {priority === watchedPriority && (
                                  <Chip size="small" label="Current" color="primary" />
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.priority && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.priority.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Category and Assigned To */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          {...field}
                          label="Category"
                          disabled={isSubmitting}
                        >
                          {TASK_CATEGORIES.map(category => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.category.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Assigned To (Email)"
                        type="email"
                        error={!!errors.assignedTo}
                        helperText={errors.assignedTo?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>

                {/* Due Date and Estimated Hours */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Due Date"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dueDate,
                            helperText: errors.dueDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="estimatedHours"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Estimated Hours"
                        type="number"
                        inputProps={{ min: 0, step: 0.5 }}
                        error={!!errors.estimatedHours}
                        helperText={errors.estimatedHours?.message}
                        disabled={isSubmitting}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    )}
                  />
                </Grid>

                {/* Created By (for new tasks) */}
                {!isEdit && (
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="createdBy"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Created By (Email)"
                          type="email"
                          error={!!errors.createdBy}
                          helperText={errors.createdBy?.message}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Error Display */}
              {(createTaskMutation.error || updateTaskMutation.error) && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {createTaskMutation.error?.message || updateTaskMutation.error?.message || 'An error occurred'}
                </Alert>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={handleClose} 
                disabled={isSubmitting}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </LocalizationProvider>
  );
}
