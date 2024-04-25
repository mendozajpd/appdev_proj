<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    public function run()
    {
        if (DB::table('genres')->count() > 0) {
            return;
        }
    
        $genres = [
            "Pop", 
            "Rock", 
            "Hip Hop", 
            "Country", 
            "Jazz", 
            "Blues", 
            "Reggae", 
            "Electronic", 
            "Dance", 
            "R&B (Rhythm and Blues)", 
            "Soul", 
            "Funk", 
            "Classical", 
            "Metal", 
            "Punk", 
            "Indie (Independent)", 
            "Folk", 
            "Singer-Songwriter", 
            "Gospel", 
            "Latin", 
            "World Music", 
            "Ambient", 
            "Trip-Hop", 
            "Techno", 
            "House", 
            "Dubstep", 
            "Drum and Bass", 
            "Trance", 
            "Progressive House", 
            "Tech House", 
            "Deep House", 
            "Disco", 
            "Funky House", 
            "Future House", 
            "Glitch Hop", 
            "Hardstyle", 
            "Hard Trance", 
            "Hardcore", 
            "Hardcore Techno", 
            "Hardcore House", 
            "Hardcore Punk", 
            "Heavy Metal", 
            "Death Metal", 
            "Black Metal", 
            "Doom Metal", 
            "Gothic Metal", 
            "Power Metal", 
            "Symphonic Metal", 
            "Progressive Metal", 
            "Punk Rock", 
            "Ska", 
            "Reggae", 
            "Dub", 
            "Dancehall", 
            "Drum and Bass", 
            "Dubstep", 
            "Future Bass", 
            "Future House", 
            "Glitch", 
            "House", 
            "Tech House", 
            "Trance", 
            "Trap", 
            "Dubstep", 
            "Future Bass", 
            "Future House", 
            "Glitch", 
            "House", 
            "Tech House", 
            "Trance", 
            "Trap"
        ];
        
        
    
        foreach ($genres as $genre) {
            DB::table('genres')->insert([
                'name' => $genre,
            ]);
        }
    }
}
