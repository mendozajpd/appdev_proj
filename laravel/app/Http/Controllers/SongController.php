<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\Listen;
use App\Models\Genre;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class SongController extends Controller
{


    public function getGenres()
    {
        $genres = Genre::all();
        return response()->json($genres);
    }

    public function getSongDetails($id)
    {
        $song = Song::find($id);
        return response()->json($song->load('album','user'));
    }

    public function getSongs()
    {
        $songs = Song::all();
        return response()->json($songs->load('album','user'));
    }

    public function getSong($filename)
    {
        $path = storage_path('app/public/songs/' . $filename);
    
        Log::info('File path: ' . $path);
    
        $file = File::get($path);
        $type = File::mimeType($path);
    
        $headers = array(
            'Content-Type' => $type,
            'Content-Disposition' => 'inline; filename="'.$filename.'"'
        );
    
        Log::info('Headers: ', $headers);
    
        return Response::stream(function() use($path) {
            $stream = fopen($path, 'r');
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, $headers);
    }
}
