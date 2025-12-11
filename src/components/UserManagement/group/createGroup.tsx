import { Dispatch, SetStateAction, useState } from 'react';
import DialogTemplate from '@/Global/Dialog';
import { useTranslations } from 'next-intl';
import { Box, Button, TextField } from '@mui/material';
import { createGroup } from '@/service/user.service';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCompanyGroups } from '@/lib/slices/userManagementSlice';

interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}
export default function CreateGroup(props: IProps) {
    const t = useTranslations('userlist')
    const [formData, setFormData] = useState({ name: '', description: '' });
    const dispatch = useAppDispatch()
    const { groups } = useAppSelector((state) => state.userManagement)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const result = await createGroup(formData.name, formData.description)
        props.setOpen(false);

        const newGroup = [...groups.data, { uuid: result.data.uuid, name: formData.name, description: formData.description }]
        dispatch(setCompanyGroups({ data: newGroup, rowCount: groups.rowCount + 1 }))
    };

    return (
        <DialogTemplate
            open={props.open}
            setOpen={props.setOpen}
            title={t('createGroup')}
            submitFunction={handleSubmit}
            content={<>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 2,
                    pt: 2
                }}>
                    <TextField
                        fullWidth size={'medium'}
                        label={t('labelTextFielGroupname')}
                        name='name'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        size={'medium'}
                        label={t('labelTextFielGroupdescription')}
                        name='description'
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                    />
                </Box>
            </>} />
    )
}