<?php

namespace App\Services\UsersServices;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UsersUpdateServices
{
    public function update(array $data, int $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $user = User::findOrFail($id);

            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->status = $data['status'];

            if (!empty($data['password'])) {
                $user->password = $data['password'];
            }

            $user->save();

            if ($data['role'] === 'super-admin') {
                $user->syncRoles(['super-admin']);
                $user->syncPermissions([]);
            } elseif ($data['role'] === 'admin') {
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
