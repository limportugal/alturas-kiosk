import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

/**
 * 
 *
 * @template TData - Type of response data
 * @template TError - Type of error
 * @param queryKey - Unique identifier for caching
 * @param queryFn - Function that fetches the data
 * @param options - Optional query configurations
 * @returns Query result (data, loading state, error, refetch, etc.)
 */

const useDynamicQuery = <TData, TError = unknown>(
    
    queryKey: QueryKey,
    
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) => {
    return useQuery<TData, TError>({
        
        queryKey,
        queryFn,
        staleTime: options?.staleTime ?? 1000 * 10, // 10 seconds default
        refetchInterval: options?.refetchInterval ?? 1000 * 10, // Auto-refetch every 10 seconds
        refetchIntervalInBackground: options?.refetchIntervalInBackground ?? false, // Only refetch when page is visible
        enabled: options?.enabled ?? true,
        ...options,
    });
};

export default useDynamicQuery;