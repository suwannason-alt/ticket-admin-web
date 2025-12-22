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
  setCompany,
} from '@/lib/slices/companyProfileSlice';
import { useTranslations } from 'next-intl';
import { updateCompanyProfile } from '@/service/company.service';
import { showAlert } from '../../lib/slices/alertSlice';


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


  const handleSave = async () => {
    try {
      if (profile) {
        const result = await updateCompanyProfile(profile.uuid, formData);
        dispatch(setCompany(result.data))
        setIsEditing(false);
        dispatch(showAlert({ message: t('updateSuccess'), severity: 'success' }));
      }
    } catch (err: any) {
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
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
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              {t('saveChange')}
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
                        value={formData.telephone || ''}
                        onChange={(e) => handleFieldChange('telephone', e.target.value)}
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
                        label="Address"
                        fullWidth
                        value={formData?.address || ''}
                        onChange={(e) => handleNestedFieldChange('address', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="City"
                        fullWidth
                        value={formData?.city || ''}
                        onChange={(e) => handleNestedFieldChange('city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Province"
                        fullWidth
                        value={formData?.state || ''}
                        onChange={(e) => handleNestedFieldChange('state', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Postal Code"
                        fullWidth
                        value={formData?.postalCode || ''}
                        onChange={(e) => handleNestedFieldChange('postalCode', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Country"
                        fullWidth
                        value={formData?.country || ''}
                        onChange={(e) => handleNestedFieldChange('country', e.target.value)}
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
