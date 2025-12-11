import { Grid, Pagination } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    onPageChange: Dispatch<SetStateAction<number>>;
    pageCount: number;
    currentPage?: number;
}
export default function PaginationComponent(props: IProps) {
    return (
        <Grid 
            container 
            justifyContent="center"
            display='flex' 
            sx={{ width: '100%' }}
        >
            <Grid size={{ xs: 12 }}>
                <Pagination
                    variant={'text'}
                    color={'primary'}
                    page={props.currentPage || 1}
                    count={props.pageCount}
                    onChange={(_, page) => { props.onPageChange(page) }}
                    sx={{ 
                        margin: '0 auto', 
                        display: 'flex', 
                        justifyContent: 'center' 
                    }}
                />
            </Grid>
        </Grid>
    );
}