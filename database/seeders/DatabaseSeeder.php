<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolePermissionSeeder::class,
        ]);

        $admin = User::firstOrCreate(
            ['name' => 'admin'],
            ['email' => 'admin@gmail.com',
            'password' => Hash::make('@dmin05/04/26')],
        
    );

        if(! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

    }
}
