'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Business,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { switchCompany, Company } from '../../lib/slices/authSlice';

interface CompanySwitcherDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CompanySwitcherDialog({ open, onClose }: CompanySwitcherDialogProps) {
  const dispatch = useAppDispatch();
  const { currentCompany, availableCompanies, switchingCompany, error } = useAppSelector((state) => state.auth);

  const handleCompanySwitch = async (company: Company) => {
    if (company.id === currentCompany?.id) {
      onClose();
      return;
    }

    try {
      await dispatch(switchCompany(company.id)).unwrap();
      onClose();
      // Optionally refresh the page or reset relevant state here
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch company:', error);
    }
  };

  const getStatusColor = (status: Company['status']) => {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business />
            Switch Company
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Current Company */}
        {currentCompany && (
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Company
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={currentCompany.logo}
                sx={{ width: 40, height: 40 }}
              >
                {currentCompany.name[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {currentCompany.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentCompany.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                <Chip
                  label={currentCompany.plan}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={currentCompany.status.toUpperCase()}
                  size="small"
                  color={getStatusColor(currentCompany.status)}
                />
              </Box>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Available Companies */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Available Companies ({availableCompanies.length})
          </Typography>
        </Box>

        <List sx={{ pt: 0 }}>
          {availableCompanies.map((company) => {
            const isCurrentCompany = company.id === currentCompany?.id;
            const isDisabled = switchingCompany;

            return (
              <ListItem key={company.id} disablePadding>
                <ListItemButton
                  onClick={() => handleCompanySwitch(company)}
                  disabled={isDisabled}
                  sx={{
                    py: 2,
                    px: 3,
                    bgcolor: isCurrentCompany ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: isCurrentCompany ? 'action.selected' : 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={company.logo}
                      sx={{ width: 40, height: 40 }}
                    >
                      {company.name[0]}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {company.name}
                        </Typography>
                        {isCurrentCompany && (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        )}
                      </Box>

                                            <Box>
                        <Typography variant="body2" color="text.secondary">
                          {company.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={company.plan}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                          <Chip
                            label={company.status.toUpperCase()}
                            size="small"
                            color={getStatusColor(company.status)}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                      </>
                    }
                  />

                  {switchingCompany && !isCurrentCompany && (
                    <CircularProgress size={20} sx={{ ml: 2 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {error && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
