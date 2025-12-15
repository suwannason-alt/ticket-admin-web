import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';


interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>,
    title: string;
    description?: string;
    submitFunction: () => void
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction={'down'} ref={ref} {...props} />;
});

export default function ConfirmComponent(props: IProps) {
    const t = useTranslations('common')
    return (
        <Dialog open={props.open} fullWidth slots={{ transition: Transition }} onClose={() => props.setOpen(false)}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography variant={'subtitle1'}>
                    {props.description}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button variant={'contained'} color={'info'} onClick={() => props.submitFunction()} autoFocus={false}>{t('submit')}</Button>
                <Button variant={'contained'} color={'error'} onClick={() => props.setOpen(false)} autoFocus={false}>{t('cancel')}</Button>
            </DialogActions>
        </Dialog>
    )
}