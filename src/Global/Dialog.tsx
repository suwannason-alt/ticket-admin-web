
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slide
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';
import { useTranslations } from 'next-intl';
import React, { Dispatch, memo, SetStateAction } from 'react';

interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    title: string;
    content: React.ReactNode;
    submitFunction?: () => void
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction={'down'} ref={ref} {...props} />
})

export default memo(function DialogTemplate(props: IProps) {
    const t = useTranslations('common')

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            fullWidth
            slots={{
                transition: Transition
            }}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>{props.content}</DialogContent>
            <DialogActions>
                {props.submitFunction && (
                    <Button onClick={props.submitFunction} variant={'contained'} autoFocus={false}>Save</Button>
                )}
                <Button
                    onClick={() => props.setOpen(false)}
                    color={'error'}
                    variant={'contained'}
                >
                    {t('cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    )
});