export type Order = 'asc' | 'desc';

export interface Column<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  width?: number;
  render?: (row: T) => React.ReactNode;

  hideable?: boolean;
}