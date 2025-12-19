
'use client'
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';
import { readENV } from '@/lib/slices/envSlice';

export default function EnvProvider({ children }: any) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(readENV());
    }, [])
    return <>{children}</>
}