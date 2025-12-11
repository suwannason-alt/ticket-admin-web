'use client';

import { Button, Grid, Stack } from '@mui/material';
import { useState } from 'react';
import CreateCategory from './create';
import { useTranslations } from 'next-intl';
import { Create } from '@mui/icons-material';
import DataTable from '../../Global/data-table';

export default function CategoryHome() {

    const [openCreate, setOpenCreate] = useState(false)
    const t = useTranslations('category')
    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{ xl: 8, lg: 8 }} />
                <Grid size={{ xl: 4, lg: 4 }} textAlign={'end'}>
                    <Button
                    startIcon={<Create />}
                    variant={'contained'}
                    onClick={() => setOpenCreate(true)}>{t('create')}</Button>
                </Grid>
            </Grid>

            <Stack mt={2} mb={2}>
                <DataTable columns={[]} data={[]} onPageChange={() =>{} } pageCount={5} loading={false} currentPage={1} />
            </Stack>
            {openCreate ? <CreateCategory open={openCreate} setOpen={setOpenCreate} /> : null}
            
        </>
    )
}
