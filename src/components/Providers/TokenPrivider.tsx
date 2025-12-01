'use client'

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getCurrentUser } from '@/lib/slices/authSlice';
import { Skeleton } from '@mui/material';
import Cookies from 'js-cookie';
import { fetchRoles, fetchUsers } from '@/lib/slices/userManagementSlice';

export default function TokenProvider({ children }: { children: React.ReactNode }) {

    const reduxUser = useAppSelector((state) => state.auth.user);
    const reduxEnv = useAppSelector((state) => state.env);

    const [isInitialized, setIsInitialized] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        let isMounted = true;

        const initializeAccess = async () => {
            const token = Cookies.get('token');
            let userFetched = false;
            let roleFetched = false;

            if (token) {
                const userAction = await dispatch(getCurrentUser());
                const roleAction = await dispatch(fetchRoles())
                dispatch(fetchUsers())

                if (userAction.meta.requestStatus === 'fulfilled' && userAction.payload) {
                    userFetched = true;
                }
                if (roleAction.meta.requestStatus === 'fulfilled' && roleAction.payload) {
                    roleFetched = true;
                }
                let access = false;
                try {
                    const serviceUuid = reduxEnv.service;
                    const roles: any = roleAction.payload

                    if (roleAction.payload) {
                        const canAction = roles.permissions.find((perm: any) => perm.service_uuid === serviceUuid);
                        if (canAction) {
                            access = true;
                        }
                    }
                } catch (error) {
                    console.error("Error checking permissions:", error);
                }

                if (isMounted) {
                    setHasAccess(access);
                    setIsInitialized(true);
                }
            } else {
                if (reduxEnv.authWeb) {
                    window.location.href = `${reduxEnv.authWeb}`
                }
                if (isMounted) {
                    setIsInitialized(true);
                }
            }
        };

        if (!reduxEnv.loading && !isInitialized) {
            initializeAccess();
        }

        return () => {
            isMounted = false;
        };
    }, [dispatch, reduxEnv, isInitialized]);


    if (reduxEnv.loading || !isInitialized) {
        return (<Skeleton variant="rectangular" width="100%" height="100vh" />);
    }

    if (hasAccess && reduxUser) {
        return <>{children}</>;
    }

    if (!hasAccess && reduxUser) {
        return (
            <>
                <h1>You do not have permission to access this application.</h1>
            </>
        )
    }
    return (<Skeleton variant="rectangular" width="100%" height="100vh" />)
}