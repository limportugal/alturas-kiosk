import Toggle from '@/Kiosk-Admin/components/Buttons/toggle';
import { useVariationToggleStatus } from '@/Kiosk-Admin/hooks/mutation-hooks/variationMutation/useVariationToggleStatus';

interface Props {
    id: number;
    status: boolean;
}

export default function VariationToggleStatus({ id, status }: Props) {
    const { mutate, isPending } = useVariationToggleStatus();

    return (
        <Toggle
            checked={status}
            onChange={() => mutate(id)}
            disabled={isPending}
        />
    );
}
