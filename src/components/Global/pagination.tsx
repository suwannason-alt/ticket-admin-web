
import { Pagination } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    onPageChange: Dispatch<SetStateAction<number>>,
    pageCount: number;
    currentPage?: number;
}
export default function PaginationComponent(props: IProps) {
    return (
        <>
            <Pagination
                variant={'text'}
                color={'primary'}
                page={props.currentPage || 1}
                count={props.pageCount}
                onChange={(_, page) => { props.onPageChange(page) }}
            />
        </>
    )
}