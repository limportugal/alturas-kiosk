import * as React from 'react';
import { IconButton, TableCell, TableRow } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableTableRowProps = {
  id: number;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  cursor?: string;
};

export default function SortableTableRow({
  id,
  children,
  onClick,
  cursor = 'default',
}: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <TableRow
      ref={setNodeRef}
      hover
      onClick={onClick}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      sx={{
        cursor,
        opacity: isDragging ? 0.6 : 1,
        backgroundColor: isDragging ? '#faf8fc' : undefined,
      }}
    >
      <TableCell sx={{ width: 48 }}>
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </TableCell>

      {children}
    </TableRow>
  );
}