'use client';

import { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Business,
  LocationOn,
  PhotoCamera,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchCompanyProfile,
} from '@/lib/slices/companyProfileSlice';
import { useTranslations } from 'next-intl';


export default function CompanyProfileForm() {
  const t = useTranslations('companyProfile')
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'basic' | 'address'>('basic');
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

  const sections = [
    { id: 'basic', label: t('basicInfimation'), icon: <Business /> },
    { id: 'address', label: t('address'), icon: <LocationOn /> },
  ];

  if (!profile || !formData.name) return null;

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
        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            {t('editProfile')}
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
              // onClick={handleSave}
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
                {t('sections')}
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
                    {t('basicInfimation')}
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
                    {t('companyAddress')}
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }} mt={2}>
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

            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
