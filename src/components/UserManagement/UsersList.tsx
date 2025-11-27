'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchUsers, User } from '../../lib/slices/userManagementSlice';
import InviteUserDialog from './InviteUserDialog';

import { useTranslations } from 'next-intl';
import DataTable from '../Global/data-table';

export default function UsersList() {
  const t = useTranslations('userlist');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.userManagement);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  return (

    <Box>
      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('users')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('description')}
          </Typography>
        </Box>
        {/* <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setInviteDialogOpen(true)}
        >
          {t('invite')}
        </Button> */}

      </Box>
      <Box mt={2}>
        <DataTable
          columns={[
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'lastname', header: 'Lastname' },
            { accessorKey: 'role', header: 'Role'},
            { accessorKey: 'action', header: 'Action' }
          ]}
          data={[]} onPageChange={() => { }}
          currentPage={2}
          pageCount={5}
          loading={false}
        />

      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
