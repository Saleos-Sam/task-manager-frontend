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
  IconButton,
  Tooltip,
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
  Update,
  Timer,
} from '@mui/icons-material';
import { Task } from '@/types/task';
import { useTask } from '@/hooks/use-tasks';
import {
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  formatRelativeTime,
  isOverdue,
  isDueToday,
  isDueSoon,
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
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        p: 3,
        pb: 2
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" component="div" fontWeight={600} gutterBottom>
            {taskData.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={getStatusLabel(taskData.status)}
              color={getStatusColor(taskData.status)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={getPriorityLabel(taskData.priority)}
              color={getPriorityColor(taskData.priority)}
              size="small"
              variant="outlined"
            />
            {taskData.category && (
              <Chip
                label={taskData.category}
                size="small"
                variant="outlined"
              />
            )}

            {/* Action Icons */}
            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
              <Tooltip title={taskData.status !== 'TODO' ? 'Task already started' : 'Start Task'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={handleStart}
                    disabled={taskData.status !== 'TODO'}
                    color="primary"
                    sx={{
                      border: '1px solid',
                      borderColor: taskData.status === 'TODO' ? 'primary.main' : 'action.disabled',
                      '&:hover': {
                        bgcolor: 'primary.lighter'
                      }
                    }}
                  >
                    <PlayArrow fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={taskData.status === 'IN_PROGRESS' ? 'Mark as Complete' : 'Start task first'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={handleComplete}
                    disabled={taskData.status !== 'IN_PROGRESS'}
                    color="success"
                    sx={{
                      border: '1px solid',
                      borderColor: taskData.status === 'IN_PROGRESS' ? 'success.main' : 'action.disabled',
                      '&:hover': {
                        bgcolor: 'success.lighter'
                      }
                    }}
                  >
                    <CheckCircle fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Box>
          {/* Alert */}
          {(overdueStatus || dueTodayStatus) && (
            <Alert
              severity={overdueStatus ? 'error' : 'warning'}
              sx={{ mb: 2 }}
            >
              {overdueStatus ? 'This task is overdue!' : 'This task is due today!'}
            </Alert>
          )}

          {/* Description */}
          {taskData.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              {taskData.description}
            </Typography>
          )}


          {/* Details in Two Columns */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: 4,
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            {/* Left Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Due Date */}
              {taskData.dueDate && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Schedule sx={{ 
                    color: dueDateInfo.color !== 'default' ? `${dueDateInfo.color}.main` : 'action.active',
                    fontSize: 20,
                    mt: 0.2
                  }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Due Date
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(taskData.dueDate)}
                    </Typography>
                    {dueDateInfo.label && (
                      <Typography variant="caption" color={`${dueDateInfo.color}.main`}>
                        {dueDateInfo.label}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {/* Assigned To */}
              {taskData.assignedTo && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Person sx={{ color: 'action.active', fontSize: 20, mt: 0.2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Assigned To
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {taskData.assignedTo}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Estimated Hours */}
              {taskData.estimatedHours && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Timer sx={{ color: 'action.active', fontSize: 20, mt: 0.2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Estimated Hours
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {taskData.estimatedHours}h
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Right Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Created By */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Person sx={{ color: 'action.active', fontSize: 20, mt: 0.2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Created By
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {taskData.createdBy || 'Unknown'}
                  </Typography>
                </Box>
              </Box>

              {/* Last Updated */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Update sx={{ color: 'action.active', fontSize: 20, mt: 0.2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatRelativeTime(taskData.updatedAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Completion Date */}
              {taskData.completionDate && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 20, mt: 0.2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Completed
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatRelativeTime(taskData.completionDate)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3, gap: 1, justifyContent: 'flex-end' }}>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Delete />}
          onClick={handleDelete}
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
