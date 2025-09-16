'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography, Alert, AlertTitle, CircularProgress, Paper } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import TaskDetails from '@/components/tasks/TaskDetails';
import { useOverdueTasks, useCompleteTask, useStartTask, useDeleteTask } from '@/hooks/use-tasks';
import { Task } from '@/types/task';

export default function OverdueTasksPage() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  
  const { data: overdueTasks, isLoading, error } = useOverdueTasks();
  const completeTaskMutation = useCompleteTask();
  const startTaskMutation = useStartTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = () => {
    setShowTaskForm(true);
    setEditingTaskId(null);
  };

  const handleEditTask = (taskId: number) => {
    setEditingTaskId(taskId);
    setShowTaskForm(true);
  };

  const handleViewTask = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
  };

  const handleCloseDetails = () => {
    setSelectedTaskId(null);
  };

  const handleEditFromDetails = (taskId: number) => {
    setSelectedTaskId(null);
    setEditingTaskId(taskId);
    setShowTaskForm(true);
  };

  const handleDeleteFromDetails = () => {
    setSelectedTaskId(null);
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleStartTask = async (taskId: number) => {
    try {
      await startTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to start task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load overdue tasks. Please try again later.
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Overdue Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tasks that are past their due date and require immediate attention
          </Typography>
        </Box>
      </Box>

      {/* Alert for overdue tasks */}
      {overdueTasks && overdueTasks.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Overdue Tasks Alert</AlertTitle>
          You have {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''} that require immediate attention!
        </Alert>
      )}

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : overdueTasks?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Overdue Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Great job! You have no overdue tasks at the moment.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {overdueTasks?.map((task) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={task.id}>
              <TaskCard
                task={task}
                onEdit={(task: Task) => handleEditTask(task.id)}
                onDelete={handleDeleteTask}
                onStart={handleStartTask}
                onComplete={handleCompleteTask}
                onView={(task: Task) => handleViewTask(task.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={showTaskForm}
        onClose={handleCloseForm}
        taskId={editingTaskId}
        mode={editingTaskId ? 'edit' : 'create'}
      />

      {/* Task Details Dialog */}
      <TaskDetails
        open={!!selectedTaskId}
        onClose={handleCloseDetails}
        taskId={selectedTaskId}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
      />
    </Layout>
  );
}
