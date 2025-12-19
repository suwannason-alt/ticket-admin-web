import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { hideAlert } from '@/lib/slices/alertSlice';
import { SyntheticEvent } from 'react';


export default function UniversalAlert() {
    const dispatch = useAppDispatch();
    const { open, message, type } = useAppSelector((state) => state.alert);

    function SlideTransition(props: SlideProps) {
        return <Slide {...props} direction={'left'} />;
    }
    const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        dispatch(hideAlert());
    };
    return (
        <Snackbar
            open={open}
            slots={{
                transition: SlideTransition
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}
        >
            <Alert severity={type ? type : 'info'} sx={{ width: '100%' }} onClose={handleClose}>
                {message}
            </Alert>
        </Snackbar>
    )
}