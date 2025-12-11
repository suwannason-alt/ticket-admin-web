
export interface ITableColumn {
    accessorKey?: string; // data key access
    header: string; // Column name
    Cell?: (row: any) => React.ReactNode;
    size?: number;
}