// resources/js/utils/formatAmount.ts

export function formatAmountInput(value: string): string {
    // Remove commas first
    const cleanValue = value.replace(/,/g, "");

    // Allow only numbers and decimal point
    const numericValue = cleanValue.replace(/[^\d.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const wholeNumber = parts[0];
    const decimal = parts[1];

    const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (decimal !== undefined) {
        return `${formattedWholeNumber}.${decimal.slice(0, 2)}`;
    }

    return formattedWholeNumber;
}

export function unformatAmount(value: string): string {
    return value.replace(/,/g, "");
}