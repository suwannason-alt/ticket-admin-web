import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';


interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>,
    title: string;
    description?: string;
}
export default function DialogComponent(props: IProps) {
    return (
        <Dialog open={props.open} fullWidth>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography variant={'subtitle1'}>
                    {props.description}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button variant={'contained'} color={'info'}>Ok</Button>
                <Button variant={'contained'} color={'error'} onClick={() => props.setOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}