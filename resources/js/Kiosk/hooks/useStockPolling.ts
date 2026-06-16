import useDynamicQuery from '@/hooks/useDynamicQuery';
import { StockCheckService, StockCheckResponse } from '@/Kiosk/services/stock/StockCheckService';

const LOW_STOCK_THRESHOLD = 3;

interface UseStockPollingParams {
    product_id:         number;
    color?:             string | null;
    enabled?:           boolean;
    initialProductQty?: number;       // seed from product prop — instant display
    initialVariantQty?: number | null; // seed variant qty if known
}

interface UseStockPollingReturn {
    productQty:   number | null;
    variantQty:   number | null;
    isSoldOut:    boolean;
    isLowStock:   boolean;
    stockDropped: boolean;
    refresh:      () => void;
}

export function useStockPolling({
    product_id,
    color,
    enabled = true,
    initialProductQty,
    initialVariantQty,
}: UseStockPollingParams): UseStockPollingReturn {

    const { data, refetch } = useDynamicQuery<StockCheckResponse>(
        ['stock-check', product_id, color ?? 'no_color'],
        () => StockCheckService(product_id, color),
        {
            enabled,
            staleTime:       0,
            refetchInterval: 1000 * 10,
        }
    );

    // Use live data when available, fall back to seeded props only on first render
    const productQty  = data?.product_quantity ?? initialProductQty ?? null;
    const variantQty  = data?.variant_quantity !== undefined ? data.variant_quantity : (initialVariantQty ?? null);
    const isSoldOut   = data?.is_sold_out ?? false;
    const relevantQty = variantQty !== null ? variantQty : productQty;
    const isLowStock  = !isSoldOut && relevantQty !== null && relevantQty <= LOW_STOCK_THRESHOLD;

    return {
        productQty,
        variantQty,
        isSoldOut,
        isLowStock,
        stockDropped: false, // simplified — no manual prev/current comparison
        refresh: refetch,
    };
}
