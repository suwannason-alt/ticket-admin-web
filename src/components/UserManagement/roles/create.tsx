import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';


interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function CreateRole(props: IProps) {
    const t = useTranslations('roleAndPermission')
    const schema = yup.object({
        name: yup.string().required('Role name is required'),
        description: yup.string().required('Description is required'),
    });
    interface FormData {
        name: string;
        description: string;
    }
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            reset();
        } catch (error) {
            console.error('Failed to create role:', error);
        }
    };

    return (
        <Dialog open={props.open} onClose={() => props.setOpen} maxWidth="sm" fullWidth>
            <DialogTitle>{t('createNewRole')}</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 1 }}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={t('roleName')}
                                fullWidth
                                margin="normal"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                placeholder={t('roleNamePlace')}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={t('createDescription')}
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                placeholder={t('createDescriptionPlace')}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { props.setOpen(false); reset(); }}>{t('cancel')}</Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={!isValid}
                >
                    {t('createRole')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}