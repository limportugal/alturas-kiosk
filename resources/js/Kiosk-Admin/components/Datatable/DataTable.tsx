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
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableTableRow from '@/Kiosk-Admin/components/Datatable/SortableTable';
import TableSearch from '@/Kiosk-Admin/components/Datatable/TableSearch';
import ColumnSelector from '@/Kiosk-Admin/components/Datatable/columnSelector';

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
  groupBy?: (row: T) => string;
  hiddenColumns?: string[];
  enableRowReordering?:boolean; // This part weather Enable or Disable
  onRowsReorder?: (rows: T[]) => void | Promise<void>; // This part will call after dragging the row and from here it will send data to backend

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

export default function DataTable<T extends { id: number, sort_order?: number }>({
  rows,
  columns,
  title,
  searchable = false,
  actions,
  defaultOrder = 'desc',
  defaultOrderBy = 'id' as keyof T,
  renderExpandedRow,
  groupBy,
  hiddenColumns: defaultHiddenColumns,
  enableRowReordering = false,
  onRowsReorder, 
}: Props<T>) {
  const [order, setOrder] = React.useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = React.useState<keyof T>(defaultOrderBy);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [expandedRowId, setExpandedRowId] = React.useState<number | null>(null);
  const [hiddenColumns, setHiddenColumns] = React.useState<string[]>(
    () => defaultHiddenColumns ?? []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const canReorder = enableRowReordering && !search;
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if(!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex  = rows.findIndex((row) => row.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Block cross-group moves when groupBy is active
    if (groupBy) {
      const activeGroup = groupBy(rows[oldIndex]);
      const overGroup   = groupBy(rows[newIndex]);
      if (activeGroup !== overGroup) return;
    }

    const reorderRows = arrayMove(rows, oldIndex, newIndex).map(
      (row, index) => ({
        ...row,
        sort_order: index + 1,
      }),
    );
    await onRowsReorder?.(reorderRows);
  };

  React.useEffect(() => {
    setHiddenColumns(defaultHiddenColumns ?? []);
  }, [defaultHiddenColumns?.join('|')]);

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
    const preparedRows =  [...fillterRows];

    if(canReorder){
      preparedRows.sort((a, b) => {
        // When groupBy is active, sort by group first, then sort_order within group
        if (groupBy) {
          const groupCompare = groupBy(a).localeCompare(groupBy(b));
          if (groupCompare !== 0) return groupCompare;
        }
        return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
      });
    } else {
      preparedRows.sort((a, b) => {
        if (groupBy) {
          const groupCompare = groupBy(a).localeCompare(groupBy(b));

          if (groupCompare !== 0) {
            return groupCompare;
          }
        }

        return getComparator(order, orderBy)(a, b);
      });
    }
     return preparedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
  }, [fillterRows, groupBy, order, orderBy, page, rowsPerPage, canReorder]);

  let currentGroup = '';
  const hasExpandedRows = typeof renderExpandedRow === 'function';

  const toggleExpandedRow = (rowId: number) => {
    if (!hasExpandedRows) return;

    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
  };

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, rowId: number) => {
    const target = event.target as HTMLElement;

    if (target.closest('button, a, input, textarea, select, [role="button"]')) {
      return;
    }

    toggleExpandedRow(rowId);
  };

  
  const toggleColumn = (id : string) => {
    setHiddenColumns((prev) => 
    prev.includes(id)
      ? prev.filter((c) => c !== id)
      : [...prev, id]
    )
  };

  const visibleColumns = React.useMemo(() => {
  return columns.filter(
    (column) => !hiddenColumns.includes(String(column.id))
  );
}, [columns, hiddenColumns]);

// const visibleColumns = columns.filter(
//   (col) => !hiddenColumns.includes(String(col.id))
// );


  return (
    <Paper 
      sx={{ 
        width: '100%',
        height: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '3',
        }}>
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
        <Box
          component="span"
          sx={{
            backgroundColor: '#5a2d82',
            color: '#fff',
            px: 2,
            py: 0.8,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 14,
        }}
        >
          {title}

       </Box>
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
          <ColumnSelector
            columns={columns.map((c) => ({
              id: String(c.id),
              label: c.label,
            }))}
            hiddenColumns={hiddenColumns}
            onToggle={toggleColumn}
          />
          {actions}
          </Box>
        </Box>
        )}
     
      <DndContext
        sensors={canReorder ? sensors : undefined}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <TableContainer
           sx={{
              width: '100%',
              flex: 1,
              overflowX: 'auto',
            }}
        >
          <Table
              stickyHeader
             sx={{
              width: '100%',
            }}
          >
            <TableHead>
              <TableRow>
                {/* {hasExpandedRows && <TableCell sx={{ width: 56 }} />} */}
                {canReorder && <TableCell sx={{ width: 48 }} />}

                {visibleColumns.map((column) => (
                  <TableCell
                    key={String(column.id)}
                    align={column.numeric ? 'right' : 'left'}
                  >
                    <TableSortLabel
                      active={!enableRowReordering && orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      disabled={enableRowReordering}
                      onClick={() =>{
                        if (enableRowReordering) return;
                        handleRequestSort(column.id);
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
        
              </TableRow>
            </TableHead>

            <TableBody>
              {canReorder ? (
                <SortableContext
                  items={visibleRows.map((row) => row.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {(() => {
                    let currentSortGroup = '';
                    return visibleRows.map((row) => {
                      const isExpanded = expandedRowId === row.id;
                      const groupName       = groupBy?.(row) ?? '';
                      const showGroupHeader = !!groupBy && groupName !== currentSortGroup;
                      if (showGroupHeader) currentSortGroup = groupName;

                      return (
                        <React.Fragment key={row.id}>
                          {showGroupHeader && (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                sx={{
                                  backgroundColor: '#f3eef8',
                                  color: '#5a2d82',
                                  fontWeight: 800,
                                  letterSpacing: 1,
                                  py: 0.5,
                                  pointerEvents: 'none',
                                }}
                              >
                                {groupName || 'No Group'}
                              </TableCell>
                            </TableRow>
                          )}
                          <SortableTableRow
                            id={row.id}
                            onClick={(event) => handleRowClick(event, row.id)}
                            cursor={hasExpandedRows ? 'pointer' : 'default'}
                          >
                            {visibleColumns.map((column) => (
                              <TableCell
                                key={String(column.id)}
                                align={column.numeric ? 'right' : 'left'}
                              >
                                {column.render
                                  ? column.render(row)
                                  : String(row[column.id])}
                              </TableCell>
                            ))}
                          </SortableTableRow>

                          {hasExpandedRows && isExpanded && (
                            <TableRow>
                              <TableCell
                                colSpan={visibleColumns.length + 1}
                                sx={{ backgroundColor: '#faf8fc', py: 2 }}
                              >
                                {renderExpandedRow?.(row)}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    });
                  })()}
                </SortableContext>
              ) : (
                visibleRows.map((row) => {
                  const isExpanded = expandedRowId === row.id;
                  const groupName = groupBy?.(row) ?? '';
                  const showGroupHeader = !!groupBy && groupName !== currentGroup;

                  if (showGroupHeader) {
                    currentGroup = groupName;
                  }

                  return (
                    <React.Fragment key={row.id}>
                      {showGroupHeader && (
                        <TableRow>
                          <TableCell
                            colSpan={visibleColumns.length + (canReorder ? 1 : 0)}
                            sx={{
                              backgroundColor: '#f3eef8',
                              color: '#5a2d82',
                              fontWeight: 800,
                              letterSpacing: 1,
                              py: 0.5,
                            }}
                          >
                            {groupName || 'No Sub Category'}
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow
                        hover={hasExpandedRows}
                        onClick={(event) => handleRowClick(event, row.id)}
                        sx={{
                          cursor: hasExpandedRows ? 'pointer' : 'default',
                        }}
                      >
                        {visibleColumns.map((column) => (
                          <TableCell
                            key={String(column.id)}
                            align={column.numeric ? 'right' : 'left'}
                          >
                            {column.render
                              ? column.render(row)
                              : String(row[column.id])}
                          </TableCell>
                        ))}
                      </TableRow>

                      {hasExpandedRows && isExpanded && (
                        <TableRow>
                          <TableCell
                            colSpan={visibleColumns.length}
                            sx={{ backgroundColor: '#faf8fc', py: 2 }}
                          >
                            {renderExpandedRow?.(row)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DndContext>
    
      <TablePagination
        component="div"
        count={fillterRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 25]}
        onPageChange={(_, newPage) =>
          setPage(newPage) 
        }
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          flexShrink: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      />
    </Paper>
  );
}
