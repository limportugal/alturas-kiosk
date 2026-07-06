import {useReOrderVariationMutation} from '@/Kiosk-Admin/hooks/mutation-hooks/variationMutation/useReOrderVariationMuntation';
import {VariationList} from '@/Kiosk-Admin/types/variation-types';

export const useVariationRowOrdering = () => {
    const { mutate, isPending, isSuccess, isError, error } = useReOrderVariationMutation(); 

    const handleRowReOrderSave = (rows: VariationList[]) => {
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