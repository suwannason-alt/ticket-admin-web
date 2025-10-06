'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Block,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchUsers, deleteUser, updateUserStatus, User } from '../../lib/slices/userManagementSlice';
import InviteUserDialog from './InviteUserDialog';

export default function UsersList() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.userManagement);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleStatusChange = (userId: string, status: User['status']) => {
    dispatch(updateUserStatus({ userId, status }));
    handleMenuClose();
  };

  const getStatusChip = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<Pending />} />;
      case 'suspended':
        return <Chip label="Suspended" color="error" size="small" icon={<Block />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.firstName} {params.row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.role.name}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.row.status),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.row.lastLogin
            ? new Date(params.row.lastLogin).toLocaleDateString()
            : 'Never'
          }
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.row.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="more"
          icon={<MoreVert />}
          label="More actions"
          onClick={(event) => handleMenuOpen(event, params.row as User)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setInviteDialogOpen(true)}
        >
          Invite User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={users}
            columns={columns}
            loading={loading.users}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                py: 2,
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {}}>
          <Edit sx={{ mr: 2 }} fontSize="small" />
          Edit User
        </MenuItem>
        {selectedUser?.status === 'active' && (
          <MenuItem onClick={() => selectedUser && handleStatusChange(selectedUser.id, 'suspended')}>
            <Block sx={{ mr: 2 }} fontSize="small" />
            Suspend User
          </MenuItem>
        )}
        {selectedUser?.status === 'suspended' && (
          <MenuItem onClick={() => selectedUser && handleStatusChange(selectedUser.id, 'active')}>
            <CheckCircle sx={{ mr: 2 }} fontSize="small" />
            Activate User
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2 }} fontSize="small" />
          Delete User
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite User Dialog */}
      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      />
    </Box>
  );
}
