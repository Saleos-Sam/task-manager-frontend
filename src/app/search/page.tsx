'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import SuspenseBoundary from '@/components/layout/SuspenseBoundary';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDetails from '@/components/tasks/TaskDetails';
import TaskForm from '@/components/tasks/TaskForm';
import { useSearchTasks, useCompleteTask, useStartTask, useDeleteTask } from '@/hooks/use-tasks';
import { Task } from '@/types/task';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { data: searchResults, isLoading, error } = useSearchTasks(debouncedQuery);
  const completeTaskMutation = useCompleteTask();
  const startTaskMutation = useStartTask();
  const deleteTaskMutation = useDeleteTask();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('q', query);
        router.replace(`/search?${newSearchParams.toString()}`);
      } else {
        router.replace('/search');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const handleClearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    router.replace('/search');
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

  const handleViewTask = (task: Task) => {
    setSelectedTaskId(task.id);
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

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
            Search Tasks
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find tasks by title, description, or any other content.
          </Typography>
        </Box>

        {/* Search Input */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search tasks by title, description, category, assignee..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} edge="end">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  padding: '8px 14px',
                },
              }}
            />
            
            {debouncedQuery && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Searching for:
                </Typography>
                <Chip
                  label={`"${debouncedQuery}"`}
                  size="small"
                  onDelete={handleClearSearch}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to search tasks. Please try again.
          </Alert>
        )}

        {isLoading && debouncedQuery && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && !debouncedQuery && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Start typing to search for tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search by task title, description, category, assignee, or any other content.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!isLoading && debouncedQuery && searchResults && searchResults.content.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No tasks match your search query "{debouncedQuery}".
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try different keywords or check your spelling.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!isLoading && searchResults && searchResults.content.length > 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Found {searchResults.totalElements} task{searchResults.totalElements !== 1 ? 's' : ''} matching "{debouncedQuery}"
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {searchResults.content.map((task) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={task.id}>
                  <TaskCard
                    task={task}
                    onView={handleViewTask}
                  />
                </Grid>
              ))}
            </Grid>
          </>
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
          onStart={handleStartTask}
          onComplete={handleCompleteTask}
        />
      </Box>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <SuspenseBoundary>
      <SearchContent />
    </SuspenseBoundary>
  );
}
