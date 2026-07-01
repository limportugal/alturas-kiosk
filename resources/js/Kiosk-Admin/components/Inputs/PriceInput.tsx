import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

interface PriceInputProps {
    label?: string;
    value: number | string;
    onChange: (value: number) => void;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    sx?: object;
}

const formatWithCommas = (val: string): string => {
    const digits = val.replace(/[^0-9.]/g, '');
    const parts = digits.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
};

export default function PriceInput({
    label = 'Price',
    value,
    onChange,
    error,
    helperText,
    fullWidth = true,
    sx,
}: PriceInputProps) {
    const [display, setDisplay] = useState(
        value !== 0 && value !== '' ? formatWithCommas(String(value)) : ''
    );

    // Sync when value changes externally (e.g. form reset or edit load)
    useEffect(() => {
        const num = Number(String(value).replace(/,/g, ''));
        if (!isNaN(num) && num !== 0) {
            setDisplay(formatWithCommas(String(num)));
        } else if (value === 0 || value === '') {
            setDisplay('');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9.]/g, '');
        setDisplay(formatWithCommas(raw));
        const num = parseFloat(raw);
        onChange(isNaN(num) ? 0 : num);
    };

    return (
        <TextField
            label={label}
            fullWidth={fullWidth}
            type="text"
            inputMode="decimal"
            value={display}
            onChange={handleChange}
            error={error}
            helperText={helperText}
            sx={sx}
            placeholder="0.00"
        />
    );
}
