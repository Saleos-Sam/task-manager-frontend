'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton,
} from '@mui/material';

interface StatisticsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  onClick?: () => void;
}

export default function StatisticsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
  isLoading = false,
  onClick,
}: StatisticsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          <Skeleton variant="text" width="30%" height={32} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Typography variant="h4" component="div" fontWeight={700} color={`${color}.main`}>
          {value}
        </Typography>

        {trend && (
          <Typography
            variant="body2"
            color={trend.isPositive ? 'success.main' : 'error.main'}
            sx={{ mt: 1, fontWeight: 500 }}
            component="div"
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
            <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
              vs last week
            </Typography>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
