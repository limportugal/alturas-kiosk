import Toggle from "@/Kiosk-Admin/components/Buttons/toggle";
import { useToggleLogoMutation } from "@/Kiosk-Admin/hooks/mutation-hooks/logoMutation/useToggleLogoMutation";

interface Props {
    id: number;
    status: boolean;
}

export default function LogoToggleStatus({ id, status }: Props) {
    const { mutate, isPending } = useToggleLogoMutation();

    return (
        <Toggle
            onChange={() => mutate(id)}
            checked={status}
            disabled={isPending}
        />
    );
}
