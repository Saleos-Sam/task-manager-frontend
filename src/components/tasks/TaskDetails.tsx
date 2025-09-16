'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Edit,
  Delete,
  PlayArrow,
  CheckCircle,
  Person,
  Schedule,
  Category,
  CalendarToday,
  Update,
  Timer,
  Flag,
} from '@mui/icons-material';
import { Task } from '@/types/task';
import { useTask } from '@/hooks/use-tasks';
import {
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isOverdue,
  isDueToday,
  isDueSoon,
  getTaskProgressPercentage,
  calculateEstimatedCompletion,
} from '@/lib/utils';

interface TaskDetailsProps {
  open: boolean;
  onClose: () => void;
  taskId: number | null;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onStart?: (taskId: number) => void;
  onComplete?: (taskId: number) => void;
}

export default function TaskDetails({
  open,
  onClose,
  taskId,
  onEdit,
  onDelete,
  onStart,
  onComplete,
}: TaskDetailsProps) {
  const { data: task, isLoading, error } = useTask(taskId || 0);

  const handleEdit = () => {
    if (task) {
      onEdit?.(task.id);
      onClose();
    }
  };

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id);
      onClose();
    }
  };

  const handleStart = () => {
    if (task) {
      onStart?.(task.id);
    }
  };

  const handleComplete = () => {
    if (task) {
      onComplete?.(task.id);
    }
  };

  if (!open || !taskId) {
    return null;
  }

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !task) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">
            Failed to load task details. Please try again.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Handle API response field mapping (snake_case to camelCase)
  const taskData = {
    ...task,
    dueDate: (task as any).due_date || task.dueDate,
    createdAt: (task as any).created_at || task.createdAt,
    updatedAt: (task as any).updated_at || task.updatedAt,
    createdBy: (task as any).created_by || task.createdBy,
    assignedTo: (task as any).assigned_to || task.assignedTo,
    estimatedHours: (task as any).estimated_hours || task.estimatedHours,
  };

  const progress = getTaskProgressPercentage(taskData.status);
  const overdueStatus = isOverdue(taskData.dueDate, taskData.status);
  const dueTodayStatus = isDueToday(taskData.dueDate);
  const dueSoonStatus = isDueSoon(taskData.dueDate);

  const getDueDateInfo = () => {
    if (overdueStatus) return { color: 'error', label: 'Overdue' };
    if (dueTodayStatus) return { color: 'warning', label: 'Due Today' };
    if (dueSoonStatus) return { color: 'info', label: 'Due Soon' };
    return { color: 'default', label: '' };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        pb: 2,
        px: 3,
        pt: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Typography variant="h5" component="div" fontWeight={700} color="primary">
          Task Details
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { 
              bgcolor: 'action.hover',
              color: 'text.primary'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1, px: 3, pt: 3 }}>
        <Box>
          {/* Status and Priority Alert */}
          {(overdueStatus || dueTodayStatus) && (
            <Alert 
              severity={overdueStatus ? 'error' : 'warning'} 
              sx={{ mb: 3 }}
              icon={<Schedule />}
            >
              This task is {overdueStatus ? 'overdue' : 'due today'}!
            </Alert>
          )}

          {/* Title and Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              {taskData.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {taskData.description || 'No description provided.'}
            </Typography>
          </Box>

          {/* Status, Priority, and Category Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={getStatusLabel(taskData.status)}
              color={getStatusColor(taskData.status)}
              icon={<Flag />}
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={getPriorityLabel(taskData.priority)}
              color={getPriorityColor(taskData.priority)}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
            {taskData.category && (
              <Chip
                icon={<Category />}
                label={taskData.category}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>

          {/* Progress */}
          {progress > 0 && (
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: 'background.default',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  Progress
                </Typography>
                <Typography variant="h5" sx={{ ml: 'auto', fontWeight: 700, color: 'primary.main' }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                  }
                }}
              />
              {taskData.estimatedHours && progress > 0 && progress < 100 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Estimated time remaining: {calculateEstimatedCompletion(taskData.estimatedHours, progress)}
                </Typography>
              )}
            </Paper>
          )}

          {/* Details Grid */}
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Due Date */}
                {taskData.dueDate && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Schedule color={dueDateInfo.color as any} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Due Date
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color={`${dueDateInfo.color}.main`}>
                        {formatDate(taskData.dueDate)}
                        {dueDateInfo.label && ` (${dueDateInfo.label})`}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Assigned To */}
                {taskData.assignedTo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Assigned To
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {taskData.assignedTo.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1" fontWeight={600}>
                          {taskData.assignedTo}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Estimated Hours */}
                {taskData.estimatedHours && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Timer color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Hours
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {taskData.estimatedHours}h
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Created */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDateTime(taskData.createdAt)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(taskData.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Last Updated */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Update color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDateTime(taskData.updatedAt)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(taskData.updatedAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Created By */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created By
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {taskData.createdBy?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body1" fontWeight={600}>
                        {taskData.createdBy || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Completion Date */}
                {taskData.completionDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle color="success" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDateTime(taskData.completionDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatRelativeTime(taskData.completionDate)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ flex: 1 }}>
          {taskData.status === 'TODO' && (
            <Tooltip title="Start working on this task">
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={handleStart}
                color="primary"
              >
                Start Task
              </Button>
            </Tooltip>
          )}

          {(taskData.status === 'TODO' || taskData.status === 'IN_PROGRESS') && (
            <Tooltip title="Mark this task as completed">
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={handleComplete}
                color="success"
                sx={{ ml: 1 }}
              >
                Mark Complete
              </Button>
            </Tooltip>
          )}
        </Box>

        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={handleDelete}
          color="error"
        >
          Delete
        </Button>

        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
