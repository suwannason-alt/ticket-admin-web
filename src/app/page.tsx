'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  People,
  Business,
  Security,
  TrendingUp,
  PersonAdd,
  Schedule,
} from '@mui/icons-material';
import DashboardLayout from '../components/DashboardLayout';
import UsersList from '../components/UserManagement/UsersList';
import RolesAndPermissions from '../components/UserManagement/RolesAndPermissions';
import InvitationsManagement from '../components/UserManagement/InvitationsManagement';
import CompanyProfileForm from '../components/CompanyProfile/CompanyProfileForm';
import SettingsPage from '../components/Settings/SettingsPage';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { fetchUsers, fetchRoles } from '../lib/slices/userManagementSlice';
import { fetchCompanyProfile } from '../lib/slices/companyProfileSlice';
import { getCurrentUser } from '../lib/slices/authSlice';

function DashboardOverview() {
  const dispatch = useAppDispatch();
  const { users, roles, invitations } = useAppSelector((state) => state.userManagement);
  const { profile } = useAppSelector((state) => state.companyProfile);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchCompanyProfile());
  }, [dispatch]);

  const recentActivities = [
    {
      id: 1,
      type: 'user_invited',
      description: 'New user invited: john.doe@company.com',
      timestamp: '2 hours ago',
      avatar: <PersonAdd />,
    },
    {
      id: 2,
      type: 'role_created',
      description: 'New role created: Content Manager',
      timestamp: '5 hours ago',
      avatar: <Security />,
    },
    {
      id: 3,
      type: 'profile_updated',
      description: 'Company profile updated',
      timestamp: '1 day ago',
      avatar: <Business />,
    },
  ];

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Roles',
      value: roles.length,
      icon: <Security sx={{ fontSize: 40, color: 'secondary.main' }} />,
      change: '+2',
      changeType: 'positive',
    },
    {
      title: 'Pending Invitations',
      value: invitations.length,
      icon: <PersonAdd sx={{ fontSize: 40, color: 'warning.main' }} />,
      change: '3 new',
      changeType: 'neutral',
    },
    {
      title: 'Company Score',
      value: '95%',
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      change: '+5%',
      changeType: 'positive',
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || 'Admin'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your organization today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {stats.map((stat, index) => (
          <Box key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      color={
                        stat.changeType === 'positive'
                          ? 'success'
                          : stat.changeType === 'negative'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </Box>
                  <Box>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Company Overview */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business />
                Company Overview
              </Typography>

              {profile && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      src={profile.logo}
                      sx={{ width: 60, height: 60 }}
                    >
                      {profile.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{profile.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.description}
                      </Typography>
                      <Chip
                        label={`${profile.subscription.plan} Plan`}
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Location
                      </Typography>
                      <Typography variant="body2">
                        {profile.address.city}, {profile.address.state}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Subscription Status
                      </Typography>
                      <Chip
                        label={profile.subscription.status.toUpperCase()}
                        size="small"
                        color={profile.subscription.status === 'active' ? 'success' : 'warning'}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Active Features
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {profile.subscription.features.length} of {profile.subscription.features.length + 2} features enabled
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule />
                Recent Activity
              </Typography>

              <List disablePadding>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem disablePadding>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.description}
                        secondary={activity.timestamp}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 2 }}>
        <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label="Invite New User"
                  clickable
                  color="primary"
                  variant="outlined"
                  icon={<PersonAdd />}
                />
                <Chip
                  label="Create Role"
                  clickable
                  color="secondary"
                  variant="outlined"
                  icon={<Security />}
                />
                <Chip
                  label="Update Profile"
                  clickable
                  color="default"
                  variant="outlined"
                  icon={<Business />}
                />
              </Box>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (viewId: string, title: string) => {
    setCurrentView(viewId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'users':
        return <UsersList />;
      case 'roles':
        return <RolesAndPermissions />;
      case 'invitations':
        return <InvitationsManagement />;
      case 'company':
        return <CompanyProfileForm />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout onNavigate={handleNavigate}>
      {renderCurrentView()}
    </DashboardLayout>
  );
}
