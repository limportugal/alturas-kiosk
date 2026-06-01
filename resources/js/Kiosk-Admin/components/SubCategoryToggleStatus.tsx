import Toggle from '@/Kiosk-Admin/components/Buttons/toggle';
import { useSubCategoryToggleStatus } from '@/Kiosk-Admin/hooks/mutation-hooks/subCategoryMutation/useSubCategoryToggleStatus';

interface Props {
    id: number;
    status: boolean;
}

export default function SubCategoryToggleStatus({ id, status }: Props) {
    const { mutate, isPending } = useSubCategoryToggleStatus();

    return (
        <Toggle
            checked={status}
            onChange={() => mutate(id)}
            disabled={isPending}
        />
    );
}
