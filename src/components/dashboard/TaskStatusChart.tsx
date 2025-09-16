'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,
} from '@mui/material';
import { TaskStatistics, TaskStatus } from '@/types/task';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

interface TaskStatusChartProps {
  data?: TaskStatistics;
  isLoading?: boolean;
}

export default function TaskStatusChart({ data, isLoading = false }: TaskStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Task Status Distribution" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" sx={{ flex: 1 }} />
                <Skeleton variant="text" width={40} />
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
        <CardHeader title="Task Status Distribution" />
        <CardContent>
          <Typography color="text.secondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const statusData = Object.entries(data.statusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      status: status as TaskStatus,
      count,
      label: getStatusLabel(status as TaskStatus),
      color: getStatusColor(status as TaskStatus),
    }));

  const total = statusData.reduce((sum, item) => sum + item.count, 0);

  // Calculate angles for the pie chart
  const chartData = statusData.map(item => ({
    ...item,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
  }));

  // Simple pie chart using CSS
  const PieSlice = ({ percentage, color, startAngle = 0 }: { percentage: number; color: string; startAngle?: number }) => {
    if (percentage === 0) return null;
    
    const endAngle = startAngle + (percentage / 100) * 360;
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    if (percentage === 100) {
      return (
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
        />
      );
    }

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return <path d={pathData} fill={color} />;
  };

  let currentAngle = 0;

  return (
    <Card>
      <CardHeader 
        title="Task Status Distribution"
        subheader={`Total: ${total} tasks`}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Pie Chart */}
          {total > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 200 }}>
              <svg width="200" height="200" viewBox="0 0 100 100">
                {chartData.map((item, index) => {
                  const slice = (
                    <PieSlice
                      key={item.status}
                      percentage={item.percentage}
                      color={
                        item.color === 'default' ? '#9e9e9e' :
                        item.color === 'primary' ? '#1976d2' :
                        item.color === 'secondary' ? '#dc004e' :
                        item.color === 'success' ? '#2e7d32' :
                        item.color === 'warning' ? '#ed6c02' :
                        item.color === 'error' ? '#d32f2f' :
                        item.color === 'info' ? '#0288d1' : '#9e9e9e'
                      }
                      startAngle={currentAngle}
                    />
                  );
                  currentAngle += (item.percentage / 100) * 360;
                  return slice;
                })}
                <circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="white"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {total}
                </text>
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fill="#666"
                >
                  Tasks
                </text>
              </svg>
            </Box>
          )}

          {/* Legend */}
          <Box sx={{ flex: 1 }}>
            <List dense>
              {chartData.map((item) => (
                <ListItem key={item.status} disablePadding>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: 
                          item.color === 'default' ? 'grey.500' :
                          item.color === 'primary' ? 'primary.main' :
                          item.color === 'secondary' ? 'secondary.main' :
                          item.color === 'success' ? 'success.main' :
                          item.color === 'warning' ? 'warning.main' :
                          item.color === 'error' ? 'error.main' :
                          item.color === 'info' ? 'info.main' : 'grey.500',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={500}>
                          {item.label}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" fontWeight={600}>
                            {item.count}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
