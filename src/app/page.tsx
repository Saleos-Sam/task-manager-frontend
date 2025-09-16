'use client';

import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Alert } from '@mui/material';
import { Add, Task, Assignment, Schedule, PriorityHigh, TrendingUp, Group } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StatisticsCard from '@/components/dashboard/StatisticsCard';
import TaskStatusChart from '@/components/dashboard/TaskStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import RecentTasks from '@/components/dashboard/RecentTasks';
import TaskForm from '@/components/tasks/TaskForm';
import TaskDetails from '@/components/tasks/TaskDetails';
import { useTaskStatistics } from '@/hooks/use-tasks';

export default function Dashboard() {
  const router = useRouter();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const { data: statistics, isLoading: isLoadingStats, error: statsError } = useTaskStatistics();

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleViewTask = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handleViewAllTasks = () => {
    router.push('/tasks');
  };

  const handleViewOverdue = () => {
    router.push('/tasks/overdue');
  };

  const handleViewDueToday = () => {
    router.push('/tasks/due-today');
  };

  const handleViewHighPriority = () => {
    router.push('/tasks?priority=HIGH');
  };

  if (statsError) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load dashboard data. Please check if the backend server is running at localhost:8080.
        </Alert>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Welcome back! Here's what's happening with your tasks.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateTask}
            size="large"
          >
            Create Task
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Total Tasks"
              value={statistics?.overall.total || 0}
              subtitle="All tasks in system"
              icon={<Task />}
              color="primary"
              isLoading={isLoadingStats}
              onClick={handleViewAllTasks}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="In Progress"
              value={statistics?.statusCounts.IN_PROGRESS || 0}
              subtitle="Currently active"
              icon={<Assignment />}
              color="info"
              isLoading={isLoadingStats}
              onClick={() => router.push('/tasks?status=IN_PROGRESS')}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Overdue"
              value={statistics?.overall.overdue || 0}
              subtitle="Need immediate attention"
              icon={<Schedule />}
              color="error"
              isLoading={isLoadingStats}
              onClick={handleViewOverdue}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Due Today"
              value={statistics?.overall.dueToday || 0}
              subtitle="Tasks due today"
              icon={<Schedule />}
              color="warning"
              isLoading={isLoadingStats}
              onClick={handleViewDueToday}
            />
          </Grid>
        </Grid>

        {/* Additional Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="High Priority"
              value={statistics?.priorityCounts.HIGH || 0}
              subtitle="Important tasks"
              icon={<PriorityHigh />}
              color="warning"
              isLoading={isLoadingStats}
              onClick={handleViewHighPriority}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Completed"
              value={statistics?.statusCounts.COMPLETED || 0}
              subtitle="Finished tasks"
              icon={<TrendingUp />}
              color="success"
              isLoading={isLoadingStats}
              onClick={() => router.push('/tasks?status=COMPLETED')}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Urgent Tasks"
              value={statistics?.priorityCounts.URGENT || 0}
              subtitle="Critical priority"
              icon={<PriorityHigh />}
              color="error"
              isLoading={isLoadingStats}
              onClick={() => router.push('/tasks?priority=URGENT')}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatisticsCard
              title="Categories"
              value={Object.keys(statistics?.categoryCounts || {}).length}
              subtitle="Active categories"
              icon={<Group />}
              color="secondary"
              isLoading={isLoadingStats}
            />
          </Grid>
        </Grid>

        {/* Charts and Recent Tasks */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TaskStatusChart data={statistics} isLoading={isLoadingStats} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <PriorityChart data={statistics} isLoading={isLoadingStats} />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <RecentTasks 
              onViewTask={handleViewTask}
              onViewAll={handleViewAllTasks}
            />
          </Grid>
        </Grid>

        {/* Task Form Dialog */}
        <TaskForm
          open={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          mode="create"
        />

        {/* Task Details Dialog */}
        <TaskDetails
          open={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          taskId={selectedTaskId}
          onEdit={(taskId) => {
            setSelectedTaskId(null);
          }}
          onDelete={() => {
            setSelectedTaskId(null);
          }}
        />
      </Box>
    </Layout>
  );
}