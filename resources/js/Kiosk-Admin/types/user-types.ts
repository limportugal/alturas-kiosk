export interface UserStorePayload {
    name: string;
    email: string;
    role: 'admin' | 'staff';
    password: string;
    status: 'Active' | 'Inactive';
    permissions?: string[];
}


export interface UserListItem {
    id: number;
    name: string;
    email: string;
    role: string | null;
    status: 'Active' | 'Inactive';
    permissions: string[];
    created_at?: string | null;
}
export interface UserUpdatePayload {
    name: string;
    email: string;
    role: 'admin' | 'staff';
    password?: string;
    status: 'Active' | 'Inactive';
    permissions?: string[];
}
