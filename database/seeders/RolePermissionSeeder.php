<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder {

    public function run(): void{

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view dashboard',
            'manage users',
            'manage products',
            'manage categories',
            'manage sub categories',
            'manage variations',
            'manage ads',
            'manage kiosk settings',
            'view reports',
            'print receipts',
        ];

        
    foreach($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
        }


    
    $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $staffRole = Role::firstOrCreate(['name' => 'staff']);

    $superAdminRole->givePermissionTo(Permission::all());
    $adminRole->givePermissionTo(Permission::all());
    
    $staffRole->givePermissionTo([
        'view dashboard',
        'manage products',
        'manage categories',
        'manage sub categories',
        'manage variations',
        'manage ads',
        'view reports',
        'print receipts',
    ]);



    }

}