'use client';

import { useEffect, useState } from 'react';
import { deleteGroup, listGroup } from '@/service/user.service';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCompanyGroups } from '@/lib/slices/userManagementSlice'
import DataTable from '@/Global/data-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Streetview } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import ConfirmComponent from '@/Global/confirm-dialog';
import GroupMember from './member';


export default function GroupList() {
    const t = useTranslations('userlist')
    const dispatch = useAppDispatch()
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
    const { groups } = useAppSelector((state) => state.userManagement);
    const [selectedUUID, setSelectedUUID] = useState<string>('');
    const [openGroupMember, setOpenGroupMember] = useState<boolean>(false);

    const fetchGroupResult = async () => {
        const results = await listGroup(page, 10)
        if (results.data) {
            dispatch(setCompanyGroups({ data: results.data.data, rowCount: results.data.rowCount }))
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchGroupResult();
    }, [page])

    const handleSubmitDelete = async () => {
        try {
            setLoading(true);
            await deleteGroup(selectedUUID);
            await fetchGroupResult();
        } catch (error) {

        }
        setLoading(false)
        setOpenConfirmDelete(false)
    }

    return (
        <>
            <ConfirmComponent
                open={openConfirmDelete}
                setOpen={setOpenConfirmDelete}
                title={t('wantToDeleteGroup')}
                description={t('deleteGoupDescription')}
                submitFunction={handleSubmitDelete}
            />

            {selectedUUID !== '' && openGroupMember ? <GroupMember
                open={openGroupMember}
                setOpen={setOpenGroupMember}
                groupUUID={selectedUUID}
            /> : null}
            <DataTable columns={[
                { accessorKey: 'name', header: t('tableHeadGroupname') },
                { accessorKey: 'description', header: t('tableHeadDescription') },
                {
                    accessorKey: 'action', header: t('tableHeadAction'), Cell: ({ row }) => {
                        const rowData = row.original
                        return <>
                            <Box sx={{ display: 'flex', gap: 3 }} aria-hidden={'false'}>
                                <Box>
                                    <IconButton sx={{ padding: 0 }} aria-hidden={'false'} onClick={() => { setOpenGroupMember(true); setSelectedUUID(rowData.uuid) }}>
                                        <Tooltip title={t('manageUserGroup')}>
                                            <Streetview color={'info'} sx={{ cursor: 'pointer' }} />
                                        </Tooltip>
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title={t('edit')}>
                                        <IconButton sx={{ padding: 0 }} size={'small'} aria-hidden={'false'}>
                                            <Edit color={'warning'} sx={{ cursor: 'pointer ' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Box>
                                        <Box>
                                            <Tooltip title={t('delete')}>
                                                <IconButton aria-hidden={'false'} sx={{ padding: 0 }} size={'small'} onClick={() => { setOpenConfirmDelete(true); setSelectedUUID(rowData.uuid) }}>
                                                    <Delete color={'error'} sx={{ cursor: 'pointer ' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    }
                }
            ]}
                data={groups.data}
                currentPage={page}
                onPageChange={setPage}
                pageCount={Math.ceil(groups.rowCount / 10)}
                loading={loading}
            />

        </>
    )

}