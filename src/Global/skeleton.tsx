
import { Skeleton } from '@mui/material';
export default function SkeletonLoad(props: { width?: number; height?: number, variant?: 'text' | 'rectangular' | 'circular' }) {

    return (
        <Skeleton
            variant={props.variant || 'text'}
            width={props.width || '100%'}
            height={props.height || 20}
        />
    )
}