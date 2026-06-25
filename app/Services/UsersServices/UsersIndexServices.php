<?php

namespace App\Services\UsersServices;

use App\Models\User;

use Spatie\Permission\Models\Permission;

class UsersIndexServices {
    
    public function index(): array
    {
        $users = User::query()
            ->latest()
            ->get()
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first(),
                    'status' => $user->status,
                    'permissions' => $user->getAllPermissions()->pluck('name')->values(),
                    'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
                ];
            });

        $permissions = Permission::query()
            ->orderBy('name')
            ->pluck('name')
            ->values();

        return [
            'users' => $users,
            'permissions' => $permissions,
        ];
    }
}
