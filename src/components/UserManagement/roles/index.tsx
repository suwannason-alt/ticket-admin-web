
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import { useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import CreateRole from './create';
import RoleLayout from './layout';
import Preload from '@/Global/preload';

export default function RolesAndPermissions() {
  const t = useTranslations('roleAndPermission')
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [tabVale, setTabValue] = useState(0)

  const { system } = useAppSelector((state) => state.role);


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

      <Tabs value={tabVale} onChange={handleTabChange}>
        <Tab label={'System role'} />
        <Tab label={'Custom role'} disabled />
      </Tabs>

      <div hidden={tabVale !== 0} style={{ marginTop: '15px' }}>
        <Preload state={system} render={
          <RoleLayout
            roles={system}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            count={system.length} />

        }
          skeleton={{
            width: 100,
            height: 100,
          }}
        />

      </div>

      <div hidden={tabVale !== 1}>
        <p>Custom role</p>
      </div>

      {/* Create Role Dialog */}
      <CreateRole open={createDialogOpen} setOpen={setCreateDialogOpen} />
    </Box>
  );
}
