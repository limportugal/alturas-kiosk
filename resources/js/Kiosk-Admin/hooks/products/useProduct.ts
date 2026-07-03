import {useReOrderProductMutation} from '@/Kiosk-Admin/hooks/mutation-hooks/productMutation/useReorderProductMutation';
import {ProductItem} from '@/Kiosk-Admin/types/product-type';

export const useProductRowOrdering = () => {
    const { mutate, isPending, isSuccess, isError, error } = useReOrderProductMutation(); 

    const handleRowReOrderSave = (rows: ProductItem[]) => {
        const ids = rows.map((row) => Number(row.id));

        mutate({
            ids,
        });

    }

    return {
        handleRowReOrderSave,
        isPending,
        isSuccess,
        isError,
        error,
    };
};