'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import { TaskStatistics, TaskPriority } from '@/types/task';
import { getPriorityColor, getPriorityLabel } from '@/lib/utils';

interface PriorityChartProps {
  data?: TaskStatistics;
  isLoading?: boolean;
}

export default function PriorityChart({ data, isLoading = false }: PriorityChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Priority Distribution" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={40} />
                </Box>
                <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1 }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader title="Priority Distribution" />
        <CardContent>
          <Typography color="text.secondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const priorityOrder: TaskPriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
  const priorityData = priorityOrder.map(priority => ({
    priority,
    count: data.priorityCounts[priority] || 0,
    label: getPriorityLabel(priority),
    color: getPriorityColor(priority),
  }));

  const total = priorityData.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...priorityData.map(item => item.count));

  return (
    <Card>
      <CardHeader 
        title="Priority Distribution"
        subheader={`Total: ${total} tasks`}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {priorityData.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            const relativeWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

            return (
              <Box key={item.priority}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.label}
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={relativeWidth}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 
                          item.color === 'error' ? 'error.main' :
                          item.color === 'warning' ? 'warning.main' :
                          item.color === 'info' ? 'info.main' :
                          item.color === 'success' ? 'success.main' :
                          'primary.main',
                        borderRadius: 4,
                      },
                    }}
                  />
                  {relativeWidth > 20 && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.625rem',
                      }}
                    >
                      {item.count}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {total === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No tasks found
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
