'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  PlayArrow,
  CheckCircle,
  Person,
  Schedule,
  Category,
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
  isDueSoon,
  getTaskProgressPercentage,
  truncateText,
} from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onStart?: (taskId: number) => void;
  onComplete?: (taskId: number) => void;
  onView?: (task: Task) => void;
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStart, 
  onComplete, 
  onView 
}: TaskCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(task.id);
    handleMenuClose();
  };

  const handleStart = () => {
    onStart?.(task.id);
    handleMenuClose();
  };

  const handleComplete = () => {
    onComplete?.(task.id);
    handleMenuClose();
  };

  const handleCardClick = () => {
    onView?.(task);
  };

  const progress = getTaskProgressPercentage(task.status);
  const overdueStatus = isOverdue(task.dueDate, task.status);
  const dueTodayStatus = isDueToday(task.dueDate);
  const dueSoonStatus = isDueSoon(task.dueDate);

  const getDueDateColor = () => {
    if (overdueStatus) return 'error';
    if (dueTodayStatus) return 'warning';
    if (dueSoonStatus) return 'info';
    return 'default';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
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
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.3,
              flex: 1,
              mr: 1,
            }}
          >
            {truncateText(task.title, 60)}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ ml: 1 }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {task.description || 'No description'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={getStatusLabel(task.status)}
            color={getStatusColor(task.status)}
            size="small"
            variant="filled"
          />
          <Chip
            label={getPriorityLabel(task.priority)}
            color={getPriorityColor(task.priority)}
            size="small"
            variant="outlined"
          />
          {task.category && (
            <Chip
              icon={<Category fontSize="small" />}
              label={task.category}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Progress
              </Typography>
              <Typography variant="body2" sx={{ ml: 'auto', fontSize: '0.75rem', fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                borderRadius: 2,
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {task.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule fontSize="small" color={getDueDateColor() as any} />
              <Typography variant="body2" color={`${getDueDateColor()}.main`} sx={{ fontSize: '0.75rem' }}>
                Due {formatDate(task.dueDate)}
                {overdueStatus && ' (Overdue)'}
                {dueTodayStatus && ' (Today)'}
              </Typography>
            </Box>
          )}

          {task.assignedTo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {task.assignedTo}
              </Typography>
            </Box>
          )}

          {task.estimatedHours && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Estimated: {task.estimatedHours}h
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
            {task.createdBy?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {formatRelativeTime(task.createdAt)}
          </Typography>
        </Box>

        {task.status === 'TODO' && (
          <Tooltip title="Start Task">
            <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); onStart?.(task.id); }}>
              <PlayArrow fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {(task.status === 'TODO' || task.status === 'IN_PROGRESS') && (
          <Tooltip title="Mark Complete">
            <IconButton size="small" color="success" onClick={(e) => { e.stopPropagation(); onComplete?.(task.id); }}>
              <CheckCircle fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        {task.status === 'TODO' && (
          <MenuItem onClick={handleStart}>
            <PlayArrow fontSize="small" sx={{ mr: 1 }} />
            Start
          </MenuItem>
        )}
        {(task.status === 'TODO' || task.status === 'IN_PROGRESS') && (
          <MenuItem onClick={handleComplete}>
            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
            Complete
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
