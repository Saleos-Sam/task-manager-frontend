'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  Person,
  Schedule,
  Category,
  Timer,
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
  truncateText,
} from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onView?: (task: Task) => void;
}

export default function TaskCard({ 
  task, 
  onView 
}: TaskCardProps) {
  const handleCardClick = () => {
    onView?.(task);
  };

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


        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {task.estimatedHours} hours
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

    </Card>
  );
}
