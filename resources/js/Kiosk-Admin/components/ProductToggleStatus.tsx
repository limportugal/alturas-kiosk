import Toggle from "@/Kiosk-Admin/components/Buttons/toggle";
import {useToggleProductStatus} from '@/Kiosk-Admin/hooks/products/useToggleStatus';

interface Props {
    id: number;
    status: boolean;
}

export default function  ProductToggleStatus({id, status}: Props) {
    const {mutate, isPending} = useToggleProductStatus();

    return (
        <Toggle
            checked={status}
            disabled={isPending}
            onChange={() => mutate(id)}
        />
    )
}