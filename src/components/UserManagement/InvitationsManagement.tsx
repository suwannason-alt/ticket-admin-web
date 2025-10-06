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
import React from 'react';

export default function InvitationsManagement() {

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Invitations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user invitations and track their status
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => alert('Invite user functionality would open here')}
        >
          Send Invitation
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a demo of the invitations management interface. In a real application, this would show pending invitations with options to resend or cancel them.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            Pending Invitations ({mockInvitations.filter(inv => inv.status === 'pending').length})
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
                          Role: {invitation?.roleName} • Invited by: {invitation?.invitedBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sent: {new Date(invitation.createdAt).toLocaleDateString()} •
                          Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
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
