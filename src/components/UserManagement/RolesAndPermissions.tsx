'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  Security,
  Group,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  fetchRoles,
  createRole,
  updateRolePermissions,
  Role,
  Permission,
} from '../../lib/slices/userManagementSlice';

const schema = yup.object({
  name: yup.string().required('Role name is required'),
  description: yup.string().required('Description is required'),
});

interface FormData {
  name: string;
  description: string;
}

export default function RolesAndPermissions() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const dispatch = useAppDispatch();
  const { roles, services, loading, error } = useAppSelector((state) => state.userManagement);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const generateDefaultPermissions = (): Permission[] => {
    const permissions: Permission[] = [];
    const features = ['Users', 'Roles', 'Invitations', 'Profile', 'Settings'];

    services.forEach((service) => {
      features.forEach((feature) => {
        permissions.push({
          id: `${service.toLowerCase().replace(/\s+/g, '-')}-${feature.toLowerCase()}`,
          serviceName: service,
          featureName: feature,
          view: false,
          insert: false,
          update: false,
          delete: false,
        });
      });
    });

    return permissions;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const defaultPermissions = generateDefaultPermissions();
      await dispatch(createRole({
        name: data.name,
        description: data.description,
        permissions: defaultPermissions,
      })).unwrap();

      reset();
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const handlePermissionChange = (
    permission: Permission,
    type: 'view' | 'insert' | 'update' | 'delete',
    checked: boolean
  ) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.map((p) =>
      p.id === permission.id ? { ...p, [type]: checked } : p
    );

    dispatch(updateRolePermissions({
      roleId: selectedRole.id,
      permissions: updatedPermissions,
    }));

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  const handleSelectAllPermissions = (serviceName: string, checked: boolean) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.map((p) =>
      p.serviceName === serviceName
        ? { ...p, view: checked, insert: checked, update: checked, delete: checked }
        : p
    );

    dispatch(updateRolePermissions({
      roleId: selectedRole.id,
      permissions: updatedPermissions,
    }));

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  const getPermissionStats = (role: Role) => {
    const totalPermissions = role.permissions.length * 4; // 4 CRUD operations per permission
    const grantedPermissions = role.permissions.reduce((count, p) => {
      return count + (p.view ? 1 : 0) + (p.insert ? 1 : 0) + (p.update ? 1 : 0) + (p.delete ? 1 : 0);
    }, 0);

    return { total: totalPermissions, granted: grantedPermissions };
  };

  const groupedPermissions = selectedRole?.permissions.reduce((groups, permission) => {
    const service = permission.serviceName;
    if (!groups[service]) {
      groups[service] = [];
    }
    groups[service].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Roles & Permissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user roles and their access permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Role
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '400px 1fr' }, gap: 1 }}>
        {/* Roles List */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Group />
                Roles ({roles.length})
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {roles.map((role) => {
                  const stats = getPermissionStats(role);
                  const isSelected = selectedRole?.id === role.id;

                  return (
                    <Card
                      key={role.id}
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                      onClick={() => setSelectedRole(role)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {role.name}
                          </Typography>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEditingRole(role); }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {role.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                          <Chip
                            label={`${stats.granted}/${stats.total} permissions`}
                            size="small"
                            color={stats.granted > 0 ? 'primary' : 'default'}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Permissions Editor */}
        <Box>
          <Card>
            <CardContent>
              {selectedRole ? (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security />
                    Permissions for {selectedRole.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Configure access permissions for each service and feature
                  </Typography>

                  {groupedPermissions && Object.entries(groupedPermissions).map(([serviceName, permissions]) => (
                    <Accordion key={serviceName} defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mr: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {serviceName}
                          </Typography>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              const hasAllPermissions = permissions.every(p => p.view && p.insert && p.update && p.delete);
                              handleSelectAllPermissions(serviceName, !hasAllPermissions);
                            }}
                          >
                            {permissions.every(p => p.view && p.insert && p.update && p.delete) ? 'Unselect All' : 'Select All'}
                          </Button>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                          {permissions.map((permission) => (
                            <Box key={permission.id}>
                              <Typography variant="subtitle2" gutterBottom>
                                {permission.featureName}
                              </Typography>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={permission.view}
                                      onChange={(e) => handlePermissionChange(permission, 'view', e.target.checked)}
                                      size="small"
                                    />
                                  }
                                  label="View"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={permission.insert}
                                      onChange={(e) => handlePermissionChange(permission, 'insert', e.target.checked)}
                                      size="small"
                                    />
                                  }
                                  label="Insert"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={permission.update}
                                      onChange={(e) => handlePermissionChange(permission, 'update', e.target.checked)}
                                      size="small"
                                    />
                                  }
                                  label="Update"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={permission.delete}
                                      onChange={(e) => handlePermissionChange(permission, 'delete', e.target.checked)}
                                      size="small"
                                    />
                                  }
                                  label="Delete"
                                />
                              </FormGroup>
                            </Box>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Security sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a role to manage permissions
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Create Role Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Role Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="e.g., Content Manager"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Describe the role's responsibilities and access level"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateDialogOpen(false); reset(); }}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={!isValid || loading.roles}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
