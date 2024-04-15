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
    public function listen(Song $song)
    {
        if (!$song) {
            return response()->json(['message' => 'Song not found'], 404);
        }
    
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        Listen::create([
            'user_id' => $userId,
            'song_id' => $song->id,
        ]);
    
        $song->increment('listens_count');
    
        return response()->json(['message' => 'Song listened']);
    }

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
