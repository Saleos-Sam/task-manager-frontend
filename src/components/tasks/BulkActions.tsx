'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Edit,
  CheckCircle,
  PlayArrow,
  Cancel,
} from '@mui/icons-material';
import { TaskStatus } from '@/types/task';
import { useBulkUpdateStatus, useBulkDeleteTasks } from '@/hooks/use-tasks';
import { getStatusLabel } from '@/lib/utils';

interface BulkActionsProps {
  selectedTaskIds: number[];
  onClearSelection: () => void;
  disabled?: boolean;
}

export default function BulkActions({ selectedTaskIds, onClearSelection, disabled = false }: BulkActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('TODO');

  const bulkUpdateMutation = useBulkUpdateStatus();
  const bulkDeleteMutation = useBulkDeleteTasks();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus = () => {
    setShowStatusDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      await bulkUpdateMutation.mutateAsync({
        taskIds: selectedTaskIds,
        status: selectedStatus,
      });
      setShowStatusDialog(false);
      onClearSelection();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedTaskIds);
      setShowDeleteDialog(false);
      onClearSelection();
    } catch (error) {
      console.error('Failed to delete tasks:', error);
    }
  };

  if (selectedTaskIds.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          bgcolor: 'background.paper',
          boxShadow: 4,
          borderRadius: 2,
          p: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${selectedTaskIds.length} selected`}
            color="primary"
            variant="filled"
          />
          
          <Button
            variant="outlined"
            size="small"
            onClick={onClearSelection}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            endIcon={<MoreVert />}
            onClick={handleMenuClick}
            disabled={disabled}
          >
            Actions
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleUpdateStatus}>
          <Edit sx={{ mr: 1 }} />
          Update Status
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete Tasks
        </MenuItem>
      </Menu>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Task Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update the status for {selectedTaskIds.length} selected task{selectedTaskIds.length !== 1 ? 's' : ''}.
          </Typography>

          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={selectedStatus}
              label="New Status"
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
            >
              {(['TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'] as TaskStatus[]).map(status => (
                <MenuItem key={status} value={status}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {status === 'TODO' && <PlayArrow fontSize="small" />}
                    {status === 'IN_PROGRESS' && <Edit fontSize="small" />}
                    {status === 'ON_HOLD' && <Cancel fontSize="small" />}
                    {status === 'COMPLETED' && <CheckCircle fontSize="small" />}
                    {status === 'CANCELLED' && <Cancel fontSize="small" />}
                    {getStatusLabel(status)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {bulkUpdateMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to update task status. Please try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)} disabled={bulkUpdateMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            variant="contained"
            disabled={bulkUpdateMutation.isPending}
          >
            {bulkUpdateMutation.isPending ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Tasks</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          
          <Typography variant="body1">
            Are you sure you want to delete {selectedTaskIds.length} selected task{selectedTaskIds.length !== 1 ? 's' : ''}?
          </Typography>

          {bulkDeleteMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to delete tasks. Please try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} disabled={bulkDeleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={bulkDeleteMutation.isPending}
          >
            {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete Tasks'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
