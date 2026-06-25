<?php

namespace App\Services\UsersServices;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UsersStoreServices {

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'status'   => $data['status'] ?? 'Active',
            ]);

            if ($data['role'] === 'admin') {
                $user->syncRoles(['admin']);
                $user->syncPermissions([]);
            } else {
                $user->syncRoles(['staff']);
                $user->syncPermissions($data['permissions'] ?? []);
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
                'status' => $user->status,
                'permissions' => $user->getAllPermissions()->pluck('name')->values(),
            ];
        });
    }
}
