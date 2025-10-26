'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  Task,
  Add,
  Analytics,
  Assignment,
  AssignmentTurnedIn,
  Schedule,
  PriorityHigh,
} from '@mui/icons-material';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTaskStatistics } from '@/hooks/use-tasks';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: statistics } = useTaskStatistics();

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      badge: null,
    },
    {
      text: 'All Tasks',
      icon: <Task />,
      path: '/tasks',
      badge: statistics?.overall.total || null,
    },
    {
      text: 'Create Task',
      icon: <Add />,
      path: '/tasks/new',
      badge: null,
    },
    {
      text: 'Analytics',
      icon: <Analytics />,
      path: '/analytics',
      badge: null,
    },
  ];

  const quickFilters = [
    {
      text: 'To Do',
      icon: <Assignment />,
      path: '/tasks?status=TODO',
      badge: statistics?.statusCounts.TODO || null,
    },
    {
      text: 'In Progress',
      icon: <Assignment />,
      path: '/tasks?status=IN_PROGRESS',
      badge: statistics?.statusCounts.IN_PROGRESS || null,
    },
    {
      text: 'Completed',
      icon: <AssignmentTurnedIn />,
      path: '/tasks?status=COMPLETED',
      badge: statistics?.statusCounts.COMPLETED || null,
    },
    {
      text: 'Overdue',
      icon: <Schedule />,
      path: '/tasks/overdue',
      badge: statistics?.overall.overdue || null,
    },
    {
      text: 'High Priority',
      icon: <PriorityHigh />,
      path: '/tasks?priority=HIGH',
      badge: statistics?.priorityCounts.HIGH || null,
    },
    {
      text: 'Due Today',
      icon: <Schedule />,
      path: '/tasks/due-today',
      badge: statistics?.overall.dueToday || null,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const renderListItem = (item: any) => {
    // Build current URL with query params
    const currentUrl = searchParams.toString() 
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    
    // Check if the item path matches the current URL
    const isActive = currentUrl === item.path;

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          onClick={() => handleNavigation(item.path)}
          sx={{
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            backgroundColor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? 'primary.contrastText' : 'inherit',
            '&:hover': {
              backgroundColor: isActive ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive ? 'primary.contrastText' : 'inherit',
              minWidth: 40,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
            }}
          />
          {item.badge && (
            <Badge
              badgeContent={item.badge}
              color={isActive ? 'secondary' : 'primary'}
              max={999}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" fontWeight={700} color="primary">
          Task Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your tasks efficiently
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 1 }}>
          {navigationItems.map(renderListItem)}
        </List>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            Quick Filters
          </Typography>
        </Box>

        <List sx={{ py: 0 }}>
          {quickFilters.map(renderListItem)}
        </List>

      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: 2,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
