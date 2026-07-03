import {useReOrderSubCategoryMutation} from '@/Kiosk-Admin/hooks/mutation-hooks/subCategoryMutation/userReOrderSubCategoryMutation';
import {SubCategoryList} from '@/Kiosk-Admin/types/subcategory-types';

export const useSubCategoryRowOrdering = () => {
    const { mutate, isPending, isSuccess, isError, error } = useReOrderSubCategoryMutation(); 

    const handleRowReOrderSave = (rows: SubCategoryList[]) => {
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