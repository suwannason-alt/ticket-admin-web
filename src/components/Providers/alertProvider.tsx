'use client';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import { hideAlert } from '@/lib/slices/alertSlice';
import UniversalAlert from '../../Global/alert';

export default function AlertProvider({ children }: { children: React.ReactNode }) {

    const dispatch = useAppDispatch();
    const { open } = useAppSelector((state) => state.alert);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                dispatch(hideAlert());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [open])

    return (<>
        <UniversalAlert />
        {children}
    </>)
}