import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import DialogTemplate from '@/Global/Dialog';
import { useTranslations } from 'next-intl';
import { addMemberToGroup, listGroupMember, listMemberNotInGroup } from '@/service/user.service';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import DataTable from '@/Global/data-table';
import UniversalAlert from '@/Global/alert';
import { useAppDispatch } from '@/lib/hooks';
import { showAlert } from '../../../lib/slices/alertSlice';

interface IProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
    groupUUID: string;
}
export default function GroupMember(props: IProps) {
    const dispatch = useAppDispatch();
    const t = useTranslations('userlist')
    const [page, setPage] = useState<number>(1);
    const [userPage, setUserPage] = useState<number>(1);
    const [userData, setUserData] = useState([]);

    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState<number>(1);

    const [rowUserCount, setRowUserCount] = useState<number>(1);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [uuids, setUuids] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUsers = async () => {
        try {
            const results = await listMemberNotInGroup(inputValue, props.groupUUID, userPage, 10);
            setUserData(results.data.data)
            setRowUserCount(results.data.rowCount)
        } catch (error) {

        }
    }
    const fetchMember = async () => {
        try {
            const results = await listGroupMember(props.groupUUID, page, 10);
            setRowCount(results.data.rowCount);
            setData(results.data.data)
            setLoading(false);

        } catch (error) {
            console.log(error);

        }
    }

    const addMembers = async () => {
        try {
            if (uuids.length === 0) {
                dispatch(showAlert({ message: t('noUserSelected'), type: 'warning' }));
                return;
            }
            await addMemberToGroup(props.groupUUID, uuids);
            dispatch(showAlert({ message: t('addMemberSuccess'), type: 'success' }));
            setSelectedUsers([]);
            setUuids([]);
            setLoading(true);
            fetchMember();
            fetchUsers();
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchUsers();
    }, [userPage]);

    useEffect(() => {
        if (selectedUsers.length > 0) {
            const uuids = selectedUsers.map((u) => u.uuid)
            setUuids(uuids);
        } else {
            setUuids([]);
        }


    }, [selectedUsers,])

    useEffect(() => {
        setLoading(true);
        fetchMember();
    }, [page])


    const searchTimeout = useRef<number | undefined>(undefined);
    useEffect(() => {
        window.clearTimeout(searchTimeout.current);
        searchTimeout.current = window.setTimeout(() => {
            setInputValue(inputValue)
            fetchUsers();
        }, 300);
        return () => window.clearTimeout(searchTimeout.current);
    }, [inputValue]);

    return (
        <>
        <UniversalAlert />
            <DialogTemplate
                open={props.open}
                setOpen={props.setOpen}
                title={t('groupMember')}
                // fullScreen
                content={<>

                    <Box mt={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Autocomplete
                                options={userData}
                                getOptionLabel={(value: any) => value.displayName}
                                multiple
                                inputValue={inputValue}
                                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                                sx={{ width: 320 }}
                                value={selectedUsers}
                                slotProps={{
                                    listbox: {
                                        onScroll: (event: React.UIEvent<HTMLElement>) => {
                                            console.log('scrolling');
                                        }
                                    }
                                }}
                                onChange={(_, newValue) => setSelectedUsers(newValue)}
                                renderInput={(params) => <TextField {...params} label="Users" size="small" />}
                            />

                            <Button variant={'contained'} size={'small'} onClick={addMembers}>{t('addGroupMember')}</Button>
                        </Box>
                        <Box mt={2}>
                            <DataTable
                                columns={[
                                    { accessorKey: 'email', header: t('tableHeadEmail'), size: 40 },
                                    { accessorKey: 'displayName', header: t('tableHeadDisplayname') },
                                    { accessorKey: 'roleName', header: t('role') },
                                ]}
                                data={data}
                                pageCount={Math.ceil(rowCount / 10)}
                                currentPage={page}
                                loading={loading}
                                onPageChange={setPage}
                            />
                        </Box>
                    </Box>
                </>}
            />
        </>
    )
}