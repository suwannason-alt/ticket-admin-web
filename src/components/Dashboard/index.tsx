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
import React, { JSX, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchCompanyProfile } from '../../lib/slices/companyProfileSlice';
import Preload from '../Global/preload';

export default function DashboardView() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.companyProfile);
  const { user } = useAppSelector((state) => state.auth);

  const [render, setRender] = React.useState<JSX.Element | null>(null);

  useEffect(() => {
    dispatch(fetchCompanyProfile());
  }, [dispatch]);

  useEffect(() => {

    setRender(<><Preload
      state={profile}
      render={<Avatar sx={{ width: 60, height: 60 }}>{profile?.name[0]}</Avatar>}
      skeleton={{
        width: 60,
        height: 60,
        variant: 'circular'
      }}
    />
      <Preload
        state={profile}
        render={
          <Box>
            <Typography variant="h6">{profile?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.description}
            </Typography>
            <Chip
              label={`${profile?.subscription.plan} Plan`}
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          </Box>
        }
        skeleton={{
          width: 200,
          height: 80,
          variant: 'rectangular'
        }}
      />
    </>)
  }, [profile])

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

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.displayName || 'Admin'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your organization today.
        </Typography>
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

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>

                  {render}
                </Box>
                {profile && (
                  <>
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
                  </>
                )}
              </Box>
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
                        slotProps={{
                          primary: { variant: 'body2' },
                          secondary: { variant: 'caption' }
                        }}
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
        <Card elevation={3}>
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