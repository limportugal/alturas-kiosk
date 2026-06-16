import { Switch } from '@mui/material';
import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import api from '@/lib/axios';
import { relativeRoute } from '@/lib/relativeRoute';
import { useToast } from '@/hooks/use-toast';

const toggleAdStatus = async (id: number) => {
    const response = await api.put(relativeRoute('ads-status', id));
    return response.data;
};

export default function AdsToggleStatus({ id, status }: { id: number; status: boolean }) {
    const { showToast } = useToast();
    const { mutate, isPending } = useDynamicMutation({
        mutationFn:  toggleAdStatus,
        mutationKey: ['ads-list'],
        onError: () => showToast({ message: 'Failed to update status', type: 'error' }),
    });

    return (
        <Switch
            checked={status}
            disabled={isPending}
            onChange={() => mutate(id)}
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7e22ce' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7e22ce' } }}
        />
    );
}
