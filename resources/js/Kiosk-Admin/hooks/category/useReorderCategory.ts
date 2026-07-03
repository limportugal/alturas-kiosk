import {useReOrderCategoryMutation} from '@/Kiosk-Admin/hooks/mutation-hooks/categoryMutation/userReOrderCategoryMutation';
import {CategoryList} from '@/Kiosk-Admin/types/category-types';

export const useCategoryRowOrdering = () => {
    const { mutate, isPending, isSuccess, isError, error } = useReOrderCategoryMutation(); 

    const handleRowReOrderSave = (rows: CategoryList[]) => {
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