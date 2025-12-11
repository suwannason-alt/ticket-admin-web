import React, { Dispatch, SetStateAction } from 'react';
import { MaterialReactTable, MRT_RowSelectionState } from 'material-react-table';
import PaginationComponent from './pagination';
import { ITableColumn } from './interface/data-table';


interface IProps {
  columns: ITableColumn[],
  onPageChange: Dispatch<SetStateAction<number>>
  onRowSelect?: Dispatch<MRT_RowSelectionState>,
  data: any[];
  pageCount: number;
  loading: boolean;
  currentPage?: number;
}

export default function DataTable(props: IProps) {
  const { columns, data, onPageChange, pageCount, onRowSelect } = props;
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    if (onRowSelect) {
      onRowSelect(rowSelection);
    }
  }, [onRowSelect, rowSelection]);

  // Calculate positions for sticky columns
  const leftStickyColumns = 0; // Number of columns you want to freeze on the left
  const rightStickyColumns = 0; // Number of columns you want to freeze on the right

  const columnsWithStickyStyle = columns.map((col: any, index: number) => {
    if (index < leftStickyColumns) {
      // Left sticky columns
      return {
        ...col,
        muiTableHeadCellProps: {
          style: { position: 'sticky', left: `${index * 100}px`, zIndex: 1, background: 'white' },
        },
        muiTableBodyCellProps: {
          style: { position: 'sticky', left: `${index * 100}px`, zIndex: 1, background: 'white' },
        }
      };
    } else if (index >= columns.length - rightStickyColumns) {
      // Right sticky columns
      return {
        ...col,
        muiTableHeadCellProps: {
          style: { position: 'sticky', right: `${(columns.length - index - 1) * 100}px`, zIndex: 1, background: 'white' },
        },
        muiTableBodyCellProps: {
          style: { position: 'sticky', right: `${(columns.length - index - 1) * 100}px`, zIndex: 1, background: 'white' },
        }
      };
    }
    return col;
  });

  return (
    <>
      {data.length === 0 && props.loading === false ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', minHeight: '300px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>No records to display</p>
        </div>
      ) : (
        <MaterialReactTable
          columns={columnsWithStickyStyle}

          data={data}
          enablePagination
          manualPagination
          enableTopToolbar={false}
          renderBottomToolbar={
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }} className='mt-2'>
              <PaginationComponent currentPage={props.currentPage} onPageChange={onPageChange} pageCount={pageCount} />
            </div>
          }
          enableStickyHeader
          enableSorting={false}
          enableRowSelection={Boolean(onRowSelect)}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection, isLoading: props.loading }}
        />
      )}
    </>
  );
}