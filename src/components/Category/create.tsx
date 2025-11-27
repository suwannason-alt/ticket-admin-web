import {
    Button, Dialog,
    DialogContent, DialogTitle,
    Slide, Stack, TextField,
    Autocomplete, Grid, Chip
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { Dispatch, SetStateAction } from 'react';

import { useTranslations } from 'next-intl';
import { Face2, AssignmentInd } from '@mui/icons-material';

interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>> 
}

export default function CreateCategory(props: IProps) {
    const t = useTranslations('category');

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement<unknown>;
        },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction={'down'} ref={ref} {...props} />;
    });

    const handleClose = () => {
        props.setOpen(false)
    };

    return (
        <>
            <Dialog open={props.open} fullWidth slots={{ transition: Transition }} onClose={handleClose}>
                <DialogTitle>{t('create')}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField size={'medium'} label={t('name')} />
                        <TextField size={'medium'} label={t('description')} />
                        <Autocomplete
                            size={'medium'}
                            renderInput={(params) => <TextField {...params} label={t('mainCategory')} />}
                            options={[]}
                        />

                        <Grid container spacing={1}>
                            <Chip color={'success'} label={'main 1'} icon={<Face2 />} />
                            <Chip color={'success'} label={'main 1'} icon={<Face2 />} />
                        </Grid>

                        <Autocomplete
                            size={'medium'}
                            renderInput={(params) => <TextField {...params} label={t('assignTo')} />}
                            options={[]}
                        />
                        <Grid container spacing={1}>
                            <Chip color={'warning'} label={'Assign group 1'} icon={<AssignmentInd />} />
                            <Chip color={'warning'} label={'Assign group 2'} icon={<AssignmentInd />} />
                        </Grid>
                    </Stack>

                    <Stack spacing={1} mt={2}>
                        <Button variant={'contained'} className='mt-2'>{t('submit')}</Button>
                        <Button variant={'contained'} color={'secondary'} onClick={handleClose}>
                            {t('close')}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}