'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  PlayArrow,
  CheckCircle,
  Visibility,
} from '@mui/icons-material';
import { Task } from '@/types/task';
import {
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  formatRelativeTime,
  isOverdue,
  isDueToday,
  getTaskProgressPercentage,
  truncateText,
} from '@/lib/utils';

interface TaskTableViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onStart?: (taskId: number) => void;
  onComplete?: (taskId: number) => void;
  onView?: (task: Task) => void;
}

export default function TaskTableView({
  tasks,
  onEdit,
  onDelete,
  onStart,
  onComplete,
  onView,
}: TaskTableViewProps) {
  const [anchorEl, setAnchorEl] = React.useState<{ [key: number]: HTMLElement | null }>({});

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, taskId: number) => {
    event.stopPropagation();
    setAnchorEl(prev => ({ ...prev, [taskId]: event.currentTarget }));
  };

  const handleMenuClose = (taskId: number) => {
    setAnchorEl(prev => ({ ...prev, [taskId]: null }));
  };

  const handleEdit = (task: Task) => {
    onEdit?.(task);
    handleMenuClose(task.id);
  };

  const handleDelete = (taskId: number) => {
    onDelete?.(taskId);
    handleMenuClose(taskId);
  };

  const handleStart = (taskId: number) => {
    onStart?.(taskId);
    handleMenuClose(taskId);
  };

  const handleComplete = (taskId: number) => {
    onComplete?.(taskId);
    handleMenuClose(taskId);
  };

  const handleView = (task: Task) => {
    onView?.(task);
    handleMenuClose(task.id);
  };

  const getDueDateColor = (task: Task) => {
    if (isOverdue(task.dueDate, task.status)) return 'error';
    if (isDueToday(task.dueDate)) return 'warning';
    return 'default';
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tasks table">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const progress = getTaskProgressPercentage(task.status);
            const overdueStatus = isOverdue(task.dueDate, task.status);
            const dueTodayStatus = isDueToday(task.dueDate);

            return (
              <TableRow
                key={task.id}
                hover
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  ...(overdueStatus && {
                    borderLeft: 4,
                    borderLeftColor: 'error.main',
                  }),
                  ...(dueTodayStatus && {
                    borderLeft: 4,
                    borderLeftColor: 'warning.main',
                  }),
                }}
                onClick={() => onView?.(task)}
              >
                <TableCell>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.description || 'No description'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={getStatusLabel(task.status)}
                    color={getStatusColor(task.status)}
                    size="small"
                    variant="filled"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={getPriorityLabel(task.priority)}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {task.category || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  {task.assignedTo ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {task.assignedTo.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {truncateText(task.assignedTo, 20)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Unassigned
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {task.dueDate ? (
                    <Box>
                      <Typography
                        variant="body2"
                        color={`${getDueDateColor(task)}.main`}
                        sx={{ fontWeight: overdueStatus || dueTodayStatus ? 600 : 400 }}
                      >
                        {formatDate(task.dueDate)}
                      </Typography>
                      {overdueStatus && (
                        <Typography variant="caption" color="error.main">
                          Overdue
                        </Typography>
                      )}
                      {dueTodayStatus && (
                        <Typography variant="caption" color="warning.main">
                          Due Today
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No due date
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ flex: 1, height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right' }}>
                      {progress}%
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.625rem' }}>
                      {task.createdBy?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(task.createdAt)}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {task.status === 'TODO' && (
                      <Tooltip title="Start Task">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={(e) => { e.stopPropagation(); onStart?.(task.id); }}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(task.status === 'TODO' || task.status === 'IN_PROGRESS') && (
                      <Tooltip title="Mark Complete">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={(e) => { e.stopPropagation(); onComplete?.(task.id); }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, task.id)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>

                  <Menu
                    anchorEl={anchorEl[task.id]}
                    open={Boolean(anchorEl[task.id])}
                    onClose={() => handleMenuClose(task.id)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleView(task)}>
                      <Visibility fontSize="small" sx={{ mr: 1 }} />
                      View
                    </MenuItem>
                    <MenuItem onClick={() => handleEdit(task)}>
                      <Edit fontSize="small" sx={{ mr: 1 }} />
                      Edit
                    </MenuItem>
                    {task.status === 'TODO' && (
                      <MenuItem onClick={() => handleStart(task.id)}>
                        <PlayArrow fontSize="small" sx={{ mr: 1 }} />
                        Start
                      </MenuItem>
                    )}
                    {(task.status === 'TODO' || task.status === 'IN_PROGRESS') && (
                      <MenuItem onClick={() => handleComplete(task.id)}>
                        <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                        Complete
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleDelete(task.id)} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" sx={{ mr: 1 }} />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
