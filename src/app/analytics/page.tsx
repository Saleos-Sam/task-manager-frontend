'use client';

import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Person,
  Category,
  Schedule,
  Assignment,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import StatisticsCard from '@/components/dashboard/StatisticsCard';
import TaskStatusChart from '@/components/dashboard/TaskStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import { useTaskStatistics } from '@/hooks/use-tasks';

export default function AnalyticsPage() {
  const { data: statistics, isLoading, error } = useTaskStatistics();

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load analytics data. Please check if the backend server is running.
        </Alert>
      </Layout>
    );
  }

  const topCategories = statistics
    ? Object.entries(statistics.categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  const topAssignees = statistics
    ? Object.entries(statistics.assigneeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  const completionRate = statistics
    ? statistics.overall.total > 0
      ? ((statistics.statusCounts.COMPLETED / statistics.overall.total) * 100).toFixed(1)
      : '0'
    : '0';

  const inProgressRate = statistics
    ? statistics.overall.total > 0
      ? ((statistics.statusCounts.IN_PROGRESS / statistics.overall.total) * 100).toFixed(1)
      : '0'
    : '0';

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            Analytics
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Comprehensive insights into your task management performance.
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Completion Rate"
              value={`${completionRate}%`}
              subtitle="Tasks completed"
              icon={<TrendingUp />}
              color="success"
              isLoading={isLoading}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Active Tasks"
              value={`${inProgressRate}%`}
              subtitle="Currently in progress"
              icon={<Assignment />}
              color="info"
              isLoading={isLoading}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Overdue Rate"
              value={statistics?.overall.total && statistics.overall.total > 0 
                ? `${((statistics.overall.overdue / statistics.overall.total) * 100).toFixed(1)}%`
                : '0%'
              }
              subtitle="Tasks past due date"
              icon={<Schedule />}
              color="error"
              isLoading={isLoading}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Avg. per Category"
              value={topCategories.length > 0 
                ? Math.round(statistics?.overall.total! / topCategories.length)
                : 0
              }
              subtitle="Tasks per category"
              icon={<Category />}
              color="secondary"
              isLoading={isLoading}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TaskStatusChart data={statistics} isLoading={isLoading} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <PriorityChart data={statistics} isLoading={isLoading} />
          </Grid>
        </Grid>

        {/* Top Categories and Assignees */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader 
                title="Top Categories"
                subheader="Most active categories by task count"
              />
              <CardContent>
                {topCategories.length === 0 ? (
                  <Typography color="text.secondary">No categories found</Typography>
                ) : (
                  <List>
                    {topCategories.map(([category, count], index) => (
                      <ListItem key={category} divider={index < topCategories.length - 1}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: `hsl(${index * 60}, 70%, 50%)`, width: 32, height: 32 }}>
                            <Category fontSize="small" />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {category || 'Uncategorized'}
                              </Typography>
                              <Chip
                                label={count}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {statistics?.overall.total && statistics.overall.total > 0
                                ? `${((count / statistics.overall.total) * 100).toFixed(1)}% of all tasks`
                                : '0% of all tasks'
                              }
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader 
                title="Top Assignees"
                subheader="Most active team members by task count"
              />
              <CardContent>
                {topAssignees.length === 0 ? (
                  <Typography color="text.secondary">No assignees found</Typography>
                ) : (
                  <List>
                    {topAssignees.map(([assignee, count], index) => (
                      <ListItem key={assignee} divider={index < topAssignees.length - 1}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {assignee.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {assignee}
                              </Typography>
                              <Chip
                                label={count}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {statistics?.overall.total && statistics.overall.total > 0
                                ? `${((count / statistics.overall.total) * 100).toFixed(1)}% of all tasks`
                                : '0% of all tasks'
                              }
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
