'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Box,
  Button,
  Skeleton,
} from '@mui/material';
import { Visibility, MoreVert } from '@mui/icons-material';
import { useRecentTasks } from '@/hooks/use-tasks';
import { getStatusColor, getStatusLabel, formatRelativeTime, truncateText } from '@/lib/utils';

interface RecentTasksProps {
  onViewTask?: (taskId: number) => void;
  onViewAll?: () => void;
}

export default function RecentTasks({ onViewTask, onViewAll }: RecentTasksProps) {
  const { data: recentTasksData, isLoading } = useRecentTasks(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Recent Tasks" />
        <CardContent>
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} divider={index < 4}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="70%" />}
                  secondary={<Skeleton variant="text" width="50%" />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  const tasks = recentTasksData?.content || [];

  return (
    <Card>
      <CardHeader 
        title="Recent Tasks"
        subheader={`${tasks.length} most recently updated tasks`}
        action={
          <Button
            size="small"
            onClick={onViewAll}
            endIcon={<MoreVert />}
          >
            View All
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No recent tasks found
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {tasks.map((task, index) => (
              <ListItem
                key={task.id}
                divider={index < tasks.length - 1}
                sx={{
                  px: 0,
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
                onClick={() => onViewTask?.(task.id)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {task.createdBy?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </ListItemAvatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Title and Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        flex: 1,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {truncateText(task.title, 40)}
                    </Typography>
                    <Chip
                      label={getStatusLabel(task.status)}
                      color={getStatusColor(task.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 0.5,
                    }}
                  >
                    {task.description ? truncateText(task.description, 60) : 'No description'}
                  </Typography>
                  
                  {/* Footer info */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Updated {formatRelativeTime(task.updatedAt)}
                    </Typography>
                    
                    {task.assignedTo && (
                      <Typography variant="caption" color="text.secondary">
                        Assigned to {truncateText(task.assignedTo, 20)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
        
        {tasks.length > 0 && (
          <Box sx={{ pt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={onViewAll}
              fullWidth
            >
              View All Tasks
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
