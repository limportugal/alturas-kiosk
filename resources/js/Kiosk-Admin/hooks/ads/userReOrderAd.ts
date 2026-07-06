import {useReOrderAdMutation} from '@/Kiosk-Admin/hooks/mutation-hooks/adsMutation/useReOrderAdMutation';
import {AdsList} from '@/Kiosk-Admin/types/ads-types';

export const useAdsRowOrdering = () => {
    const { mutate, isPending, isSuccess, isError, error } = useReOrderAdMutation(); 

    const handleRowReOrderSave = (rows: AdsList[]) => {
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