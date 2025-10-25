'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Fab,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Add,
  FilterList,
  ViewList,
  ViewModule,
  Search,
  Clear,
  Sort,
} from '@mui/icons-material';
import { TaskFilters, TaskStatus, TaskPriority } from '@/types/task';
import { useTasks, useFilteredTasks, useCompleteTask, useStartTask, useDeleteTask } from '@/hooks/use-tasks';
import TaskCard from './TaskCard';
import TaskTableView from './TaskTableView';
import { getStatusLabel, getPriorityLabel } from '@/lib/utils';

interface TaskListProps {
  initialFilters?: TaskFilters;
  showCreateButton?: boolean;
  title?: string;
  onCreateTask?: () => void;
  onEditTask?: (taskId: number) => void;
  onViewTask?: (taskId: number) => void;
}

export default function TaskList({
  initialFilters = {},
  showCreateButton = true,
  title = 'Tasks',
  onCreateTask,
  onEditTask,
  onViewTask,
}: TaskListProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    page: 0,
    size: 12,
    sortBy: 'createdAt',
    sortDir: 'desc',
    ...initialFilters,
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Determine if we have any filters applied (excluding pagination and sorting)
  const hasFilters = filters.status || filters.priority || filters.category || 
                    filters.assignedTo || filters.createdBy || filters.searchTerm ||
                    filters.createdAfter || filters.createdBefore || 
                    filters.dueAfter || filters.dueBefore;

  // Use filtered endpoint when filters are applied, otherwise use regular endpoint
  const { data: tasksResponse, isLoading, error } = hasFilters 
    ? useFilteredTasks(filters)
    : useTasks(filters);
  const completeTaskMutation = useCompleteTask();
  const startTaskMutation = useStartTask();
  const deleteTaskMutation = useDeleteTask();


  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prev => ({ ...prev, page: value - 1 }));
  };

  const handleSearch = () => {
    handleFilterChange({ searchTerm });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 0,
      size: 12,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
    setSearchTerm('');
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

  const getActiveFiltersCount = () => {
    const filterKeys = ['status', 'priority', 'category', 'assignedTo', 'searchTerm'];
    return filterKeys.filter(key => filters[key as keyof TaskFilters]).length;
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load tasks. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {title}
          </Typography>
          {tasksResponse && (
            <Typography variant="body2" color="text.secondary">
              {tasksResponse.totalElements} task{tasksResponse.totalElements !== 1 ? 's' : ''} found
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Toggle Filters">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterList color={getActiveFiltersCount() > 0 ? 'primary' : 'inherit'} />
              {getActiveFiltersCount() > 0 && (
                <Chip
                  label={getActiveFiltersCount()}
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: -8, right: -8, minWidth: 20, height: 20 }}
                />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Grid View">
            <IconButton 
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <ViewModule />
            </IconButton>
          </Tooltip>

          <Tooltip title="Table View">
            <IconButton 
              onClick={() => setViewMode('table')}
              color={viewMode === 'table' ? 'primary' : 'default'}
            >
              <ViewList />
            </IconButton>
          </Tooltip>

          {showCreateButton && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreateTask}
              sx={{ ml: 1 }}
            >
              Create Task
            </Button>
          )}
        </Box>
      </Box>

             {/* Filters */}
       {showFilters && (
         <Paper 
           sx={{ 
             p: 3, 
             mb: 3, 
             borderRadius: 2,
             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
             border: '1px solid',
             borderColor: 'divider'
           }}
         >
           {/* Search Section */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
               Search & Filter
             </Typography>
             <Grid container spacing={2} alignItems="center">
               <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                   fullWidth
                   label="Search tasks..."
                   placeholder="Search by title, description, category, assignee..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                   InputProps={{
                     startAdornment: (
                       <Search sx={{ color: 'text.secondary', mr: 1 }} />
                     ),
                     endAdornment: searchTerm && (
                       <IconButton 
                         onClick={handleSearch} 
                         edge="end"
                         size="small"
                         sx={{ color: 'primary.main' }}
                       >
                         <Search />
                       </IconButton>
                     ),
                   }}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       borderRadius: 2,
                       '&:hover .MuiOutlinedInput-notchedOutline': {
                         borderColor: 'primary.main',
                       },
                     },
                   }}
                 />
               </Grid>

               <Grid size={{ xs: 12, md: 6 }}>
                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                   <Button
                     variant="outlined"
                     startIcon={<Clear />}
                     onClick={handleClearFilters}
                     sx={{ 
                       borderRadius: 2,
                       textTransform: 'none',
                       fontWeight: 500
                     }}
                   >
                     Clear All
                   </Button>
                 </Box>
               </Grid>
             </Grid>
           </Box>

           {/* Filter Controls */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2, color: 'text.secondary' }}>
               Filter Options
             </Typography>
             <Grid container spacing={2}>
               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                 <FormControl fullWidth>
                   <InputLabel>Status</InputLabel>
                   <Select
                     value={filters.status || ''}
                     label="Status"
                     onChange={(e) => handleFilterChange({ status: e.target.value as TaskStatus || undefined })}
                     sx={{
                       borderRadius: 2,
                       '& .MuiOutlinedInput-notchedOutline': {
                         borderColor: 'divider',
                       },
                     }}
                   >
                     <MenuItem value="">All Statuses</MenuItem>
                     {(['TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'] as TaskStatus[]).map(status => (
                       <MenuItem key={status} value={status}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Box
                             sx={{
                               width: 8,
                               height: 8,
                               borderRadius: '50%',
                               bgcolor: status === 'TODO' ? 'warning.main' :
                                        status === 'IN_PROGRESS' ? 'info.main' :
                                        status === 'ON_HOLD' ? 'warning.dark' :
                                        status === 'COMPLETED' ? 'success.main' : 'error.main'
                             }}
                           />
                           {getStatusLabel(status)}
                         </Box>
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>

               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                 <FormControl fullWidth>
                   <InputLabel>Priority</InputLabel>
                   <Select
                     value={filters.priority || ''}
                     label="Priority"
                     onChange={(e) => handleFilterChange({ priority: e.target.value as TaskPriority || undefined })}
                     sx={{
                       borderRadius: 2,
                       '& .MuiOutlinedInput-notchedOutline': {
                         borderColor: 'divider',
                       },
                     }}
                   >
                     <MenuItem value="">All Priorities</MenuItem>
                     {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TaskPriority[]).map(priority => (
                       <MenuItem key={priority} value={priority}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Box
                             sx={{
                               width: 8,
                               height: 8,
                               borderRadius: '50%',
                               bgcolor: priority === 'LOW' ? 'success.main' :
                                        priority === 'MEDIUM' ? 'warning.main' :
                                        priority === 'HIGH' ? 'error.main' : 'error.dark'
                             }}
                           />
                           {getPriorityLabel(priority)}
                         </Box>
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>

               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                 <TextField
                   fullWidth
                   label="Category"
                   placeholder="Enter category..."
                   value={filters.category || ''}
                   onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       borderRadius: 2,
                       '&:hover .MuiOutlinedInput-notchedOutline': {
                         borderColor: 'primary.main',
                       },
                     },
                   }}
                 />
               </Grid>

               <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                 <TextField
                   fullWidth
                   label="Assigned To"
                   placeholder="Enter email..."
                   value={filters.assignedTo || ''}
                   onChange={(e) => handleFilterChange({ assignedTo: e.target.value || undefined })}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       borderRadius: 2,
                       '&:hover .MuiOutlinedInput-notchedOutline': {
                         borderColor: 'primary.main',
                       },
                     },
                   }}
                 />
               </Grid>
             </Grid>
           </Box>

           {/* Sort Controls */}
           <Box sx={{ 
             pt: 2, 
             borderTop: '1px solid', 
             borderColor: 'divider',
             display: 'flex', 
             gap: 2, 
             alignItems: 'center',
             flexWrap: 'wrap'
           }}>
             <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
               Sort by:
             </Typography>
             <FormControl size="small" sx={{ minWidth: 140 }}>
               <InputLabel>Field</InputLabel>
               <Select
                 value={filters.sortBy || 'createdAt'}
                 label="Field"
                 onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                 sx={{
                   borderRadius: 2,
                   '& .MuiOutlinedInput-notchedOutline': {
                     borderColor: 'divider',
                   },
                 }}
               >
                 <MenuItem value="createdAt">Created Date</MenuItem>
                 <MenuItem value="updatedAt">Updated Date</MenuItem>
                 <MenuItem value="title">Title</MenuItem>
                 <MenuItem value="dueDate">Due Date</MenuItem>
                 <MenuItem value="priority">Priority</MenuItem>
                 <MenuItem value="status">Status</MenuItem>
               </Select>
             </FormControl>

             <FormControl size="small" sx={{ minWidth: 120 }}>
               <InputLabel>Order</InputLabel>
               <Select
                 value={filters.sortDir || 'desc'}
                 label="Order"
                 onChange={(e) => handleFilterChange({ sortDir: e.target.value as 'asc' | 'desc' })}
                 sx={{
                   borderRadius: 2,
                   '& .MuiOutlinedInput-notchedOutline': {
                     borderColor: 'divider',
                   },
                 }}
               >
                 <MenuItem value="asc">Ascending</MenuItem>
                 <MenuItem value="desc">Descending</MenuItem>
               </Select>
             </FormControl>
           </Box>
         </Paper>
       )}

      {/* Content */}
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : tasksResponse?.content.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {getActiveFiltersCount() > 0 
              ? 'Try adjusting your filters or create a new task.'
              : 'Get started by creating your first task.'
            }
          </Typography>
          {showCreateButton && (
            <Button variant="contained" startIcon={<Add />} onClick={onCreateTask}>
              Create Task
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {tasksResponse?.content.map((task) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={task.id}>
                  <TaskCard
                    task={task}
                    onView={(task) => onViewTask?.(task.id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TaskTableView
              tasks={tasksResponse?.content || []}
              onEdit={(task) => onEditTask?.(task.id)}
              onDelete={handleDeleteTask}
              onStart={handleStartTask}
              onComplete={handleCompleteTask}
              onView={(task) => onViewTask?.(task.id)}
            />
          )}

          {/* Pagination */}
          {tasksResponse && tasksResponse.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={tasksResponse.totalPages}
                page={(filters.page || 0) + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      {showCreateButton && (
        <Fab
          color="primary"
          aria-label="add task"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' },
          }}
          onClick={onCreateTask}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}
