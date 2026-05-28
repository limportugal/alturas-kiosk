import { TextField } from "@mui/material";

interface TableSearchProps {
    value: string;
    onChange: (value:string) => void;
    placeholder?: string;
}

export default function TableSearch({
    value,
    onChange,
    placeholder = 'Search.....',
}: TableSearchProps) {
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}