import { useState, useEffect, useCallback, useRef } from 'react';
import { StockCheckService, StockCheckResponse } from '@/Kiosk/services/stock/StockCheckService';

const LOW_STOCK_THRESHOLD = 3;

interface UseStockPollingParams {
    product_id: number;
    color?:     string | null;
    enabled?:   boolean;
}

interface UseStockPollingReturn {
    productQty:   number | null;
    variantQty:   number | null;
    isSoldOut:    boolean;
    isLowStock:   boolean;
    stockDropped: boolean; // silent warning — stock decreased since last fetch
    refresh:      () => void;
}

export function useStockPolling({
    product_id,
    color,
    enabled = true,
}: UseStockPollingParams): UseStockPollingReturn {
    const [data, setData]                 = useState<StockCheckResponse | null>(null);
    const [stockDropped, setStockDropped] = useState(false);
    const dropTimerRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchStock = useCallback(async () => {
        try {
            const result = await StockCheckService(product_id, color);

            setData((prev) => {
                // ── Detect silent stock drop ──────────────────────────────────
                const productDropped =
                    prev !== null && result.product_quantity < prev.product_quantity;

                const variantDropped =
                    prev !== null &&
                    result.variant_quantity !== null &&
                    prev.variant_quantity !== null &&
                    result.variant_quantity < prev.variant_quantity;

                if (productDropped || variantDropped) {
                    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
                    setStockDropped(true);
                    dropTimerRef.current = setTimeout(() => setStockDropped(false), 4000);
                }

                return result;
            });
        } catch {
            // Silently fail — keep showing last known data
        }
    }, [product_id, color]);

    // ── Reset when product changes ────────────────────────────────────────
    useEffect(() => {
        setData(null);
        setStockDropped(false);
    }, [product_id]);

    // ── Fetch on mount + when product or color changes ────────────────────
    useEffect(() => {
        if (!enabled) return;
        fetchStock();
        return () => {
            if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
        };
    }, [product_id, color, enabled]);

    // ── Derived values ────────────────────────────────────────────────────
    const productQty  = data?.product_quantity ?? null;
    const variantQty  = data?.variant_quantity ?? null;
    const isSoldOut   = data?.is_sold_out ?? false;
    const relevantQty = variantQty !== null ? variantQty : productQty;
    const isLowStock  = !isSoldOut && relevantQty !== null && relevantQty <= LOW_STOCK_THRESHOLD;

    return {
        productQty,
        variantQty,
        isSoldOut,
        isLowStock,
        stockDropped,
        refresh: fetchStock,
    };
}
