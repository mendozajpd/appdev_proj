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

            $album = $user->albums()->create([
                'album_name' => $faker->sentence(1),
                'album_description' => $faker->sentence(2),
                'user_id' => $user->id,
                'cover_photo_hash' => '2264e77c40d0b139e3e77c221e5a4aaf22047d4b46af47834ffa271b50144511.png',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            for ($j = 0; $j < 400; $j++)
            $song = $album->songs()->create([
                'display_name' => $faker->sentence(1),
                'hashed_name' => '22e224f7f2038d67cd8f33d5243740fcba0b60895ddbfff7963e9b546ad556f3.mp3',
                'album_id' => $album->album_id,
                'user_id' => $user->id,
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