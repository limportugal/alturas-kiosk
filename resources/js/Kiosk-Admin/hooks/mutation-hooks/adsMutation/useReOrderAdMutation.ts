import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { AdsReOrderingService } from '@/Kiosk-Admin/services/ads/ReOrderAdServices';

export const useReOrderAdMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
         mutationFn: AdsReOrderingService,
            mutationKey: ['ads-list'],
            onSuccess: () => {
              showToast({
                message: "Advertisement re-order successfully",
                type: "success",
              });
            },
            onError: (error: any) => {
              showToast({
                message:
                  error?.response?.data?.message ?? "Failed to re order Advertisement",
                type: "error",
              });
            },
    });
}
