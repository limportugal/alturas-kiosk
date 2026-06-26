<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Http\Requests\UserStoreValidations;
use App\Http\Requests\UserUpdateValidations;

use App\Services\UsersServices\UsersIndexServices;
use App\Services\UsersServices\UsersListServices;
use App\Services\UsersServices\UsersStoreServices;
use App\Services\UsersServices\UsersUpdateServices;
use App\Services\UsersServices\UsersToggleStatusServices;

class UserController extends Controller
{
    public function index(UsersIndexServices $service)
    {
        $data = $service->index();

        return Inertia::render('Admin/Users', [
            'users' => $data['users'],
            'permissions' => $data['permissions'],
        ]);
    }

    public function list(UsersListServices $service)
    {
        $users = $service->list();

        return response()->json([
            'data' => $users,
        ]);
    }

    public function store(UserStoreValidations $request, UsersStoreServices $service)
    {
        $user = $service->store($request->validated());

        return response()->json([
            'created' => $user,
        ], 201);
    }

    public function update(UserUpdateValidations $request, UsersUpdateServices $service, $id)
    {
        $user = $service->update($request->validated(), (int) $id);

        return response()->json([
            'updated' => $user,
        ]);
    }

    public function toggle(UsersToggleStatusServices $service, $id){
        $userToggle = $service->toggleStatus($id);
        return response()->json([
            'toggle' => $userToggle
        ]);
    }
}