import { JSX } from 'react';
import SkeletonLoad from './skeleton';

interface IProps {
    state: any;
    render: (JSX.Element | null);
    skeleton: {
        width: number;
        height: number;
        variant?: 'text' | 'rectangular' | 'circular';
    }
}

export default function Preload(props: IProps) {

    return (
        <>
        {props.state ?
        props.render : 
        <SkeletonLoad width={props.skeleton.width} height={props.skeleton.height} variant={props.skeleton.variant} />}
        </>
    )

}