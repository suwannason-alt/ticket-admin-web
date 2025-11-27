'use client'

import { useEffect, useState } from 'react';
import { permissions } from '@/service/user.service';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getCurrentUser } from '@/lib/slices/authSlice';
import { readENV } from '@/lib/slices/envSlice';
import { Skeleton } from '@mui/material';

export default function TokenProvider({ children }: { children: React.ReactNode }) {

    const reduxUser = useAppSelector((state) => state.auth.user);
    const reduxEnv = useAppSelector((state) => state.env);

    const [canAccess, setCanAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(readENV());
    }, [])

    useEffect(() => {
        let isMounted = true;

        const initializeAccess = async () => {
            await dispatch(getCurrentUser());

            let hasAccess = false;

            try {
                const userPermission = await permissions();
                const serviceUuid = reduxEnv.service;

                if (userPermission && userPermission.data) {
                    const canAction = userPermission.data.find((perm: any) => perm.uuid === serviceUuid);
                    if (canAction) {
                        hasAccess = true;
                    }
                }
            } catch (error) {
                console.error("Error checking permissions:", error);
            }

            if (isMounted) {
                setCanAccess(hasAccess);
                setLoading(false);
            }
        };

        if (loading) {
            initializeAccess();
        }

        return () => {
            isMounted = false;
        };
    }, [dispatch, loading, reduxEnv.service]);


    if (loading) {
        return (<Skeleton variant="rectangular" width="100%" height="100vh" />)
    }
    if (canAccess && reduxUser) {
        return (<>
            {children}
        </>);
    }

    if (reduxUser && !canAccess) {
        return (<>
            <h1>You do not have permission to access this application.</h1>
        </>)
    }
    return (<Skeleton variant="rectangular" width="100%" height="100vh" />)
}