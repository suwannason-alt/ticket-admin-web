'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  PersonAdd,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import InviteUserDialog from './InviteUserDialog';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '../../lib/hooks';

export default function InvitationsManagement() {
  const t = useTranslations('invitations');
  const [openInvite, setOpenInvite] = useState<boolean>(false);

  const [mockInvitations, setMockInvitations] = React.useState(
    [
      {
        id: '1',
        email: 'john.doe@company.com',
        roleName: 'Editor',
        status: 'pending',
        invitedBy: 'Admin',
        createdAt: '2024-01-15',
        expiresAt: '2024-01-22',
      },
      {
        id: '2',
        email: 'jane.smith@company.com',
        roleName: 'Viewer',
        status: 'pending',
        invitedBy: 'Admin',
        createdAt: '2024-01-14',
        expiresAt: '2024-01-21',
      },
      {
        id: '3',
        email: 'mike.wilson@company.com',
        roleName: 'Manager',
        status: 'expired',
        invitedBy: 'Admin',
        createdAt: '2024-01-01',
        expiresAt: '2024-01-08',
      },
    ]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <InviteUserDialog open={openInvite} onClose={() => setOpenInvite(false)} />
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
          startIcon={<PersonAdd />}
          onClick={() => setOpenInvite(true)}
        >
          {t('inviteUser')}
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            {t('pendingInvitations')} ({mockInvitations.filter(inv => inv.status === 'pending').length})
          </Typography>

          <List>
            {mockInvitations.map((invitation) => (
              <ListItem key={invitation.id} divider>
                <ListItemText
                  primary={
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {invitation.email}
                        </Typography>
                        <Chip
                          label={invitation.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(invitation.status)}
                        />
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color={'text.secondary'}>
                          {t('role')}: {invitation?.roleName} • {t('inviteBy')}: {invitation?.invitedBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('sent')}: {new Date(invitation.createdAt).toLocaleDateString()} •
                          {t('expires')}: {new Date(invitation.expiresAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
