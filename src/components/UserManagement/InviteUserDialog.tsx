'use client';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { inviteUser, fetchRoles } from '@/lib/slices/userManagementSlice';
import { useTranslations } from 'next-intl';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
}

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  role: yup.string().required('Role is required'),
});

interface FormData {
  email: string;
  role: string;
}

export default function InviteUserDialog({ open, onClose }: InviteUserDialogProps) {
  const t = useTranslations('userlist');
  const { system } = useAppSelector((state) => state.role);

  const dispatch = useAppDispatch();
  const { roles, loading, error } = useAppSelector((state) => state.userManagement);
  const { user } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      role: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (user) {
      try {
        // await dispatch(inviteUser({
        //   email: data.email,
        //   roleId: data.roleId,
        //   invitedBy: user.uuid || '',
        // })).unwrap();
        console.log({ data });
        

        reset();
        onClose();
      } catch (error) {
        console.error('Failed to invite user:', error);
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('inviteNew')}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('email')}
                type="email"
                size={'medium'}
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="user@company.com"
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel shrink={field.value !== ''}>{t('role')}</InputLabel>
                <Select
                  {...field}
                  label="Role"
                  variant={'outlined'}
                  disabled={loading.roles}
                  displayEmpty
                  size={'medium'}
                >
                  {system.map((role) => (
                    <MenuItem key={role.uuid} value={role.uuid}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={!isValid || loading.invitations}
          startIcon={loading.invitations ? <CircularProgress size={20} /> : null}
        >
          {t('sendInvite')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
