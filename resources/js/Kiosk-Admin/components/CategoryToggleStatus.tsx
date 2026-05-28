import Toggle from "@/Kiosk-Admin/components/Buttons/toggle";
import { useToggleStatus } from "@/Kiosk-Admin/hooks/mutation-hooks/categoryMutation/useToggleStatus";

interface Props {
    id: number;
    status: boolean;
}

export default function CategoryToggleStatus({id, status}:Props) {
    const {mutate, isPending} = useToggleStatus();
    return (
        <Toggle 
            checked={status} 
            onChange={()=>mutate(id)} 
            disabled={isPending}
        />
    )
}