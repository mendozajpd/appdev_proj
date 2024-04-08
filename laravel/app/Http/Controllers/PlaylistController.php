<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Playlist;
use App\Models\Song;

class PlaylistController extends Controller
{
    public function store(Request $request)
    {
        $playlist = new Playlist;
        $playlist->name = $request->name;
        $playlist->creator_id = auth()->id();
        $playlist->save();

        return response()->json(['message' => 'Playlist created successfully']);
    }

    public function destroy(Playlist $playlist)
    {
        // Check if the authenticated user is the creator of the playlist
        if (auth()->id() !== $playlist->creator_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $playlist->delete();

        return response()->json(['message' => 'Playlist deleted successfully']);
    }

    public function addSong(Playlist $playlist, Song $song)
    {
        $playlist->songs()->attach($song->id);

        return response()->json(['message' => 'Song added to playlist']);
    }

    public function removeSong(Playlist $playlist, Song $song)
    {
        $playlist->songs()->detach($song->id);

        return response()->json(['message' => 'Song removed from playlist']);
    }
}
