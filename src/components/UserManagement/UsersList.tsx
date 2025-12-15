'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Tooltip,
} from '@mui/material';
import InviteUserDialog from './InviteUserDialog';

import { useTranslations } from 'next-intl';
import DataTable from '@/Global/data-table';
import CreateGroup from './group/createGroup';
import GroupList from './group/groupList';
import { listUser } from '@/service/user.service';
import { Delete } from '@mui/icons-material';

export default function UsersList() {
  const t = useTranslations('userlist');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [rowCount, setRowCount] = useState(1)

  const [tabVale, setTabValue] = useState(0)

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const results = await listUser(page, 10)
        setData(results.data)
        setRowCount(results.rowCount)
        setLoading(false)
      } catch (error) {

      }
    }
    fetchUsers();
  }, [page])
  return (

    <Box>
      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      />
      <CreateGroup open={openCreateGroup} setOpen={setOpenCreateGroup} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('users')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('description')}
          </Typography>
        </Box>
        <Button variant={'contained'} onClick={() => setOpenCreateGroup(true)}>{t('createGroup')}</Button>

      </Box>

      <Tabs value={tabVale} onChange={handleTabChange}>
        <Tab label={t('users')} />
        <Tab label={t('group')} />
      </Tabs>

      <Box mt={2}>
        <div hidden={tabVale !== 0}>
          <DataTable
            columns={[
              { accessorKey: 'email', header: t('tableHeadEmail'), size: 40 },
              { accessorKey: 'displayName', header: t('tableHeadDisplayname') },
              { accessorKey: 'roleName', header: t('tableHeadRole') },
              {
                accessorKey: 'groupName', header: t('tableHeadGroup'), Cell: ({ row }) => {
                  const rowData = row.original
                  const arrGroups = rowData.groupName.split(',')
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {arrGroups.map((item: string) => (
                        <Chip
                          label={item}
                          variant={'outlined'}
                          key={`${rowData.uuid}-${item}`}
                          color={'success'}
                          sx={{ flexBasis: 'calc(33.333% - 8px)' }}
                        />
                      ))}
                    </Box>
                  )
                }
              },
              {
                accessorKey: 'action', header: t('tableHeadAction'), Cell: ({ row }) => {
                  return (
                    <>
                    <Tooltip title={t('delete')}>
                      <Delete color={'error'} sx={{ cursor: 'pointer' }} />
                    </Tooltip>
                    </>
                  )
                }
              }
            ]}
            data={data} onPageChange={setPage}
            currentPage={page}
            pageCount={Math.ceil(rowCount / 10)}
            loading={loading}
          />
        </div>

        <div hidden={tabVale !== 1}>
          <GroupList />
        </div>

      </Box>
    </Box>
  );
}
