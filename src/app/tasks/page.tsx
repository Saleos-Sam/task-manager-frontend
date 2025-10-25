'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import SuspenseBoundary from '@/components/layout/SuspenseBoundary';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskDetails from '@/components/tasks/TaskDetails';
import { TaskFilters } from '@/types/task';
import { useStartTask, useCompleteTask } from '@/hooks/use-tasks';

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Mutations
  const startTaskMutation = useStartTask();
  const completeTaskMutation = useCompleteTask();

  // Parse search params to initial filters
  const initialFilters: TaskFilters = {
    status: searchParams.get('status') as any || undefined,
    priority: searchParams.get('priority') as any || undefined,
    category: searchParams.get('category') || undefined,
    assignedTo: searchParams.get('assignedTo') || undefined,
    searchTerm: searchParams.get('search') || undefined,
  };

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

  const handleStartFromDetails = async (taskId: number) => {
    try {
      await startTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to start task:', error);
    }
  };

  const handleCompleteFromDetails = async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <Layout>
      <TaskList
        initialFilters={initialFilters}
        title="All Tasks"
        showCreateButton={true}
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
        onViewTask={handleViewTask}
      />

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
        onStart={handleStartFromDetails}
        onComplete={handleCompleteFromDetails}
      />
    </Layout>
  );
}

export default function TasksPage() {
  return (
    <SuspenseBoundary>
      <TasksContent />
    </SuspenseBoundary>
  );
}
