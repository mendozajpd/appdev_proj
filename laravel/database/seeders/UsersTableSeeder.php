<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $faker = \Faker\Factory::create();

        // Create 25 artists
        for ($i = 0; $i < 25; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'), // password
                'role' => 'artist',
            ]);

            $user->albums()->create([
                'album_name' => $faker->sentence(1),
                'album_description' => $faker->sentence(2),
                'user_id' => $user->id,
                'cover_photo_hash' => '2264e77c40d0b139e3e77c221e5a4aaf22047d4b46af47834ffa271b50144511.png',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create 75 regular users
        for ($i = 0; $i < 75; $i++) {
            User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'), // password
                'role' => 'user',
            ]);
        }
    }
}