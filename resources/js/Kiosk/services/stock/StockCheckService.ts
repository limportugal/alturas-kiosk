import api from '@/lib/axios';

export interface StockCheckResponse {
    product_quantity: number;
    variant_quantity: number | null;
    is_sold_out:      boolean;
}

/**
 * Fetches current stock from backend.
 * Called on product detail open + every 10 seconds via useStockPolling.
 */
export const StockCheckService = async (
    product_id: number,
    color?: string | null
): Promise<StockCheckResponse> => {
    const params: Record<string, string | number> = { product_id };
    if (color) params.color = color;

    const response = await api.get('/kiosk/stock/check', { params });
    return response.data;
};
