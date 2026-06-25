export interface ActivityLog {
    id: number;
    user_id: number | null;
    user_name: string;
    action: string;       // 'created' | 'updated' | 'deleted' | 'toggled'
    module: string;       // 'Category' | 'Product' | etc.
    description: string;
    created_at: string;
}


export interface ActivityLogPaginated {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    total: number;
}