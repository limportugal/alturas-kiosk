import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

type Option = {
  label: string;
  value: string | number;
};

interface ReusableSelectProps {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  width?: number;
}

export default function ReusableSelect({
  label,
  value,
  options,
  onChange,
  width = 200,
}: ReusableSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: width }} size="small" fullWidth>
      <InputLabel>{label}</InputLabel>

      <Select
        value={String(value)}
        label={label}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}