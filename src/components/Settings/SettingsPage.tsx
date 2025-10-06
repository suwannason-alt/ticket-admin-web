'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  FormControlLabel,
  Button,
} from '@mui/material';
import {
  Settings,
  Notifications,
  Security,
  Palette,
  Language,
  Storage,
  Shield,
  Email,
} from '@mui/icons-material';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'General',
      icon: <Settings />,
      settings: [
        { label: 'Email Notifications', description: 'Receive email updates about system activities', enabled: true },
        { label: 'Push Notifications', description: 'Get browser notifications for important events', enabled: false },
        { label: 'Auto-save Changes', description: 'Automatically save form changes', enabled: true },
      ]
    },
    {
      title: 'Security',
      icon: <Security />,
      settings: [
        { label: 'Two-Factor Authentication', description: 'Enable 2FA for enhanced security', enabled: false },
        { label: 'Session Timeout', description: 'Auto-logout after 30 minutes of inactivity', enabled: true },
        { label: 'Login Alerts', description: 'Get notified of new login attempts', enabled: true },
      ]
    },
    {
      title: 'Appearance',
      icon: <Palette />,
      settings: [
        { label: 'Dark Mode', description: 'Use dark theme for the interface', enabled: false },
        { label: 'Compact View', description: 'Use smaller spacing for more content', enabled: false },
        { label: 'Sidebar Collapsed', description: 'Keep sidebar collapsed by default', enabled: false },
      ]
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your application preferences and security settings
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a demo settings page. In a real application, these settings would be saved to your user profile and affect the application behavior.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                {section.icon}
                {section.title}
              </Typography>

              <List disablePadding>
                {section.settings.map((setting, settingIndex) => (
                  <React.Fragment key={settingIndex}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={setting.label}
                        secondary={setting.description}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={setting.enabled}
                            onChange={() => alert(`Toggle ${setting.label}`)}
                            color="primary"
                          />
                        }
                        label=""
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                    {settingIndex < section.settings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Additional Settings Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Storage />
              Data Management
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Export Data
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Download all your data in JSON format
                </Typography>
                <Button variant="outlined" onClick={() => alert('Export data functionality')}>
                  Export Data
                </Button>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body1" gutterBottom>
                  Clear Cache
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Clear application cache and temporary data
                </Typography>
                <Button variant="outlined" onClick={() => alert('Clear cache functionality')}>
                  Clear Cache
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
              <Shield />
              Danger Zone
            </Typography>

            <Box>
              <Typography variant="body1" gutterBottom>
                Reset All Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This will reset all your preferences to default values. This action cannot be undone.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => alert('Reset settings functionality')}
              >
                Reset Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
