<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'create products',
            'edit products',
            'delete products',
            'show products',
            'manage users',
            'manage roles',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Super Admin role
        $superAdmin = Role::create(['name' => 'super-admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Create Admin role
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo([
            'create products',
            'edit products',
            'delete products',
            'show products',
        ]);

        // Create Editor role
        $editor = Role::create(['name' => 'editor']);
        $editor->givePermissionTo([
            'create products',
            'edit products',
            'show products',
        ]);

        // Create Writer role
        $writer = Role::create(['name' => 'writer']);
        $writer->givePermissionTo([
            'show products',
        ]);
    }
}