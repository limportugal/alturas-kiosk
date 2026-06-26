<?php

namespace App\Services\UsersServices;

use App\Models\User;

class UsersToggleStatusServices {

    public function toggleStatus($id){
        $user = User::findOrFail($id);

        $user->status = $user->status === 'active'
            ? 'inactive'
            : 'active';
            
        $user->save();

        return $user->fresh();
    }
}