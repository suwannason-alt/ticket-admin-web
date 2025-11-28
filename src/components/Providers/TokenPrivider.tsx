'use client'

import { useEffect, useState } from 'react';
import { permissions } from '@/service/user.service';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getCurrentUser } from '@/lib/slices/authSlice';
import { Skeleton } from '@mui/material';
import Cookies from 'js-cookie';

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

            if (token) {
                const userAction = await dispatch(getCurrentUser());
                
                if (userAction.meta.requestStatus === 'fulfilled' && userAction.payload) {
                    userFetched = true;
                }

                let access = false;
                try {
                    const userPermission = await permissions();
                    const serviceUuid = reduxEnv.service;

                    if (userPermission && userPermission.data) {
                        const canAction = userPermission.data.find((perm: any) => perm.uuid === serviceUuid);
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