<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Playlist;
use App\Models\Song;
use App\Models\PlaylistSong;


class PlaylistTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $songIds = Song::pluck('id')->toArray();

        // Create 25 playlists
        for ($i = 0; $i < 25; $i++) {
            $playlist = Playlist::create([
                'name' => $faker->sentence(1),
                'creator_id' => 103,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            shuffle($songIds);

            for ($j = 0; $j < min(1000, count($songIds)); $j++) {
                $playlist->songs()->attach($songIds[$j]);
            }
        }
        
    }
}
