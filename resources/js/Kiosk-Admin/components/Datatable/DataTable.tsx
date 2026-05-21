import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Box } from  '@mui/material';

import { Column, Order } from './types';

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  title: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

export default function DataTable<T extends { id: number }>({
  rows,
  columns,
  title,
}: Props<T>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(
    columns[0].id,
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(() => {
    
    return [...rows]
      .sort(getComparator(order, orderBy))
      .slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
  }, [rows, order, orderBy, page, rowsPerPage]);

  return (
    <Paper sx={{ width: '100%' }}>
        {title && (
        <Box
           sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
        >
          {title}
        </Box>
      )}
      <TableContainer
         sx={{
            width: '100%',
            overflowX: 'auto',
          }}

          >
        <Table
            // size="small"
           sx={{
            width: '100%',
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.numeric ? 'right' : 'left'}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={
                      orderBy === column.id ? order : 'asc'
                    }
                    onClick={() =>
                      handleRequestSort(column.id)
                    }
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.id)}
                    align={
                      column.numeric ? 'right' : 'left'
                    }
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.id])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, newPage) =>
          setPage(newPage)
        }
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}
