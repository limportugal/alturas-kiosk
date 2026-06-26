import Toggle from "@/Kiosk-Admin/components/Buttons/toggle";
import {useToggleUserStatus} from "@/Kiosk-Admin/hooks/mutation-hooks/usersMutation/useToggleUseMutation";

interface Props {
    id: number;
    status: boolean;
}

export default function  UserToggleStatus({id, status}: Props) {
    const {mutate, isPending} = useToggleUserStatus()

    return (
        <Toggle
            onChange={() => mutate(id)}
            checked={status}
            disabled={isPending}
        />
    )
}