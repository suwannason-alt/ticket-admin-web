
'use client'
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';
import { readENV } from '@/lib/slices/envSlice';
import { readSystemRole } from '@/lib/slices/roleSlice';

export default function EnvProvider({ children }: any) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(readENV());
        dispatch(readSystemRole())
    }, [])
    return <>{children}</>
}