'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Business,
  LocationOn,
  Settings as SettingsIcon,
  Subscriptions,
  PhotoCamera,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  fetchCompanyProfile,
  updateCompanyProfile,
} from '../../lib/slices/companyProfileSlice';

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'];
const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

export default function CompanyProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'basic' | 'address' | 'settings' | 'subscription'>('basic');
  const [formData, setFormData] = useState<any>({});

  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.companyProfile);

  useEffect(() => {
    dispatch(fetchCompanyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await dispatch(updateCompanyProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update company profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (parentField: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trial':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: <Business /> },
    { id: 'address', label: 'Address', icon: <LocationOn /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'subscription', label: 'Subscription', icon: <Subscriptions /> },
  ];

  if (!profile || !formData.name) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Company Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your company information and settings
          </Typography>
        </Box>
        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3 }}>
        {/* Section Navigation */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sections
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? 'contained' : 'text'}
                    startIcon={section.icon}
                    onClick={() => setSelectedSection(section.id as any)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {section.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Content Area */}
        <Box>
          <Card>
            <CardContent>
              {/* Basic Information */}
              {selectedSection === 'basic' && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business />
                    Basic Information
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Avatar
                      src={formData.logo}
                      sx={{ width: 80, height: 80 }}
                    >
                      {formData.name?.[0]}
                    </Avatar>
                    {isEditing && (
                      <IconButton color="primary">
                        <PhotoCamera />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <TextField
                        label="Company Name"
                        fullWidth
                        value={formData.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <TextField
                        label="Description"
                        multiline
                        rows={3}
                        fullWidth
                        value={formData.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Website"
                        fullWidth
                        value={formData.website || ''}
                        onChange={(e) => handleFieldChange('website', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Phone"
                        fullWidth
                        value={formData.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Address */}
              {selectedSection === 'address' && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn />
                    Company Address
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <TextField
                        label="Street Address"
                        fullWidth
                        value={formData.address?.street || ''}
                        onChange={(e) => handleNestedFieldChange('address', 'street', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="City"
                        fullWidth
                        value={formData.address?.city || ''}
                        onChange={(e) => handleNestedFieldChange('address', 'city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="State/Province"
                        fullWidth
                        value={formData.address?.state || ''}
                        onChange={(e) => handleNestedFieldChange('address', 'state', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="ZIP/Postal Code"
                        fullWidth
                        value={formData.address?.zipCode || ''}
                        onChange={(e) => handleNestedFieldChange('address', 'zipCode', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Country"
                        fullWidth
                        value={formData.address?.country || ''}
                        onChange={(e) => handleNestedFieldChange('address', 'country', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Settings */}
              {selectedSection === 'settings' && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon />
                    Company Settings
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          value={formData.settings?.timezone || ''}
                          onChange={(e) => handleNestedFieldChange('settings', 'timezone', e.target.value)}
                          label="Timezone"
                        >
                          {timezones.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                              {tz}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={formData.settings?.currency || ''}
                          onChange={(e) => handleNestedFieldChange('settings', 'currency', e.target.value)}
                          label="Currency"
                        >
                          {currencies.map((currency) => (
                            <MenuItem key={currency} value={currency}>
                              {currency}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Date Format</InputLabel>
                        <Select
                          value={formData.settings?.dateFormat || ''}
                          onChange={(e) => handleNestedFieldChange('settings', 'dateFormat', e.target.value)}
                          label="Date Format"
                        >
                          {dateFormats.map((format) => (
                            <MenuItem key={format} value={format}>
                              {format}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={formData.settings?.language || ''}
                          onChange={(e) => handleNestedFieldChange('settings', 'language', e.target.value)}
                          label="Language"
                        >
                          {languages.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Subscription */}
              {selectedSection === 'subscription' && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Subscriptions />
                    Subscription Details
                  </Typography>

                  <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Current Plan
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                          {profile.subscription?.plan}
                        </Typography>
                        <Chip
                          label={profile.subscription?.status?.toUpperCase()}
                          color={getSubscriptionStatusColor(profile.subscription?.status) as any}
                          sx={{ mb: 2 }}
                        />
                      </Box>

                      {profile.subscription?.expiresAt && (
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Expires On
                          </Typography>
                          <Typography variant="body1">
                            {new Date(profile.subscription.expiresAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Included Features
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profile.subscription?.features?.map((feature) => (
                            <Chip
                              key={feature}
                              label={feature}
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
