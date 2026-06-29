import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";

interface ColumnOption {
  id: string;
  label: string;
}

interface Props {
  columns: ColumnOption[];
  hiddenColumns: string[];
  onToggle: (id: string) => void;
}

export default function ColumnSelector({
  columns,
  hiddenColumns,
  onToggle,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ViewColumnOutlinedIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Toggle 
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {columns.map((column) => (
          <MenuItem
            key={column.id}
            onClick={() => onToggle(column.id)}
          >
            <Checkbox
              checked={!hiddenColumns.includes(column.id)}
            />

            <ListItemText primary={column.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}