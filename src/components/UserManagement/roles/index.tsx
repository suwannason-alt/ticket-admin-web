'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchRoles,
  Role,
} from '@/lib/slices/userManagementSlice';
import { useTranslations } from 'next-intl';
import CreateRole from './create';
import RoleLayout from './layout';

export default function RolesAndPermissions() {
  const t = useTranslations('roleAndPermission')
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [tabVale, setTabValue] = useState(0)

  const dispatch = useAppDispatch();
  const { roles, error } = useAppSelector((state) => state.userManagement);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('description')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          {t('createRole')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={tabVale} onChange={handleTabChange}>
        <Tab label={'System role'} />
        <Tab label={'Custom role'} />
      </Tabs>

      <div hidden={tabVale !== 0} style={{ marginTop: '15px'}}>
        <RoleLayout roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} count={2} />
      </div>

      <div hidden={tabVale !== 1}>
        <p>Custom role</p>
      </div>

      {/* Create Role Dialog */}
      <CreateRole open={createDialogOpen} setOpen={setCreateDialogOpen} />
    </Box>
  );
}
