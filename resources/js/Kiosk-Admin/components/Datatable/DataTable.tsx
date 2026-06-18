import * as React from 'react';
import {
  IconButton,
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
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

import TableSearch from '@/Kiosk-Admin/components/Datatable/TableSearch';

import { Column, Order } from './types';

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  title: string;
  searchable?: boolean;
  actions?: React.ReactNode;
  defaultOrder?: Order,
  defaultOrderBy?: keyof T;
  renderExpandedRow?: (row: T) => React.ReactNode;
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
  searchable = false,
  actions,
  defaultOrder = 'desc',
  defaultOrderBy = 'id' as keyof T,
  renderExpandedRow,
}: Props<T>) {
  const [order, setOrder] = React.useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = React.useState<keyof T>(defaultOrderBy);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [expandedRowId, setExpandedRowId] = React.useState<number | null>(null);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fillterRows = React.useMemo(() => {
    if (!search) return rows;

    return rows.filter((row) =>
    columns.some((column) => 
      String(row[column.id])
        .toLowerCase()
        .includes(search.toLowerCase()),
      ),
    );
  }, [rows, columns, search]);

  const visibleRows = React.useMemo(() => {
    return [...fillterRows]
      .sort(getComparator(order, orderBy))
      .slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
  }, [fillterRows, order, orderBy, page, rowsPerPage]);

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
        <Box
          sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
        >
        {searchable && (
            <TableSearch
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(0);
              }}
            />
 
          )}
          {actions}
          </Box>
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
              {renderExpandedRow && <TableCell sx={{ width: 56 }} />}
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
            {visibleRows.map((row) => {
              const isExpanded = expandedRowId === row.id;

              return (
                <React.Fragment key={row.id}>
                  <TableRow>
                    {renderExpandedRow && (
                      <TableCell sx={{ width: 56 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedRowId((prev) => (prev === row.id ? null : row.id))
                          }
                        >
                          {isExpanded ? (
                            <KeyboardArrowUpOutlinedIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowDownOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
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

                  {renderExpandedRow && isExpanded && (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} sx={{ backgroundColor: '#faf8fc', py: 2 }}>
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={fillterRows.length}
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
