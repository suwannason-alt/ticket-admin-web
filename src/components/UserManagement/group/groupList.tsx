'use client';

import { useEffect, useState } from 'react';
import { listGroup } from '@/service/user.service';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCompanyGroups } from '@/lib/slices/userManagementSlice'
import DataTable from '@/Global/data-table';
import { Box, Tooltip } from '@mui/material';
import { Delete, Edit, Streetview } from '@mui/icons-material';
import { useTranslations } from 'next-intl';


export default function GroupList() {
    const t = useTranslations('userlist')
    const dispatch = useAppDispatch()
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState(true)
    const { groups } = useAppSelector((state) => state.userManagement)

    useEffect(() => {
        const fetchGroupResult = async () => {
            const results = await listGroup(page, 10)
            if (results.data) {
                dispatch(setCompanyGroups({ data: results.data.data, rowCount: results.data.rowCount }))
            }

            setLoading(false)
        }
        fetchGroupResult();
    }, [page])

    return (
        <>

            <DataTable columns={[
                { accessorKey: 'name', header: 'Name' },
                { accessorKey: 'description', header: 'Description' },
                {
                    accessorKey: 'action', header: 'Action', Cell: ({ row }) => {
                        const rowData = row.original
                        return <>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box>
                                    <Streetview color={'info'} sx={{ cursor: 'pointer' }} />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title={t('edit')}>
                                        <Edit color={'inherit'} sx={{ cursor: 'pointer ' }} />
                                    </Tooltip>
                                    <Box>
                                        <Box>
                                            <Tooltip title={t('delete')}>
                                                <Delete color={'error'} sx={{ cursor: 'pointer ' }} />
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
                onPageChange={setPage}
                pageCount={Math.ceil(groups.rowCount / 10)}
                loading={loading}
            />

        </>
    )

}