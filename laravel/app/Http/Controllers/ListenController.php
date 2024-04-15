<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Listen;
use App\Models\Song;
use App\Models\User;
use App\Models\Album;

class ListenController extends Controller
{
    public function mostListenedSongOfArtist($artistId, $limit)
    {
        $mostListenedSongs = Listen::with(['song', 'song.album'])
            ->whereHas('song', function ($query) use ($artistId) {
                $query->where('user_id', $artistId);
            })
            ->select('song_id', DB::raw('count(*) as total_listens'))
            ->groupBy('song_id')
            ->orderBy('total_listens', 'desc')
            ->take($limit)
            ->get();
    
        return response()->json(['songs' => $mostListenedSongs]);
    }

    public function mostListenedSong($limit)
    {
        $mostListenedSongs = Listen::select('song_id', DB::raw('count(*) as total_listens'))
            ->groupBy('song_id')
            ->orderBy('total_listens', 'desc')
            ->take($limit)
            ->get()
            ->load('song');

        return response()->json(['songs' => $mostListenedSongs]);
    }

    public function mostListenedArtist($limit)
    {
        $mostListenedArtists = Listen::join('songs', 'listens.song_id', '=', 'songs.id')
        ->select('songs.user_id', DB::raw('count(*) as total_listens'))
        ->groupBy('songs.user_id')
        ->orderBy('total_listens', 'desc')
        ->take($limit)
        ->get()
        ->load('user');

        return response()->json(['artists' => $mostListenedArtists]);
    }

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
}
