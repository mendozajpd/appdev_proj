<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Playlist;
use App\Models\Song;
use App\Models\PlaylistSong;

class PlaylistController extends Controller
{   
    // PLAYLIST SONGS
    public function getPlaylistSongs($id)
    {
        $playlist = Playlist::find($id);
    
        if ($playlist === null) {
            return response()->json(['message' => 'Playlist not found'], 404);
        }
    
        $songs = $playlist->songs()->with('album','user')->paginate(10);
    
        return response()->json(['songs' => $songs, 'playlist' => $playlist]);
    }

    // PLAYLIST
    public function getPlaylist($id)
    {
        $playlist = Playlist::find($id);
    
        if ($playlist === null) {
            return response()->json(['message' => 'Playlist not found'], 404);
        }
    
        return response()->json($playlist);
    }
    
    public function getPlaylists()
    {
        $user = auth()->user();
        
        if ($user === null) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $playlists = Playlist::where('creator_id', $user->id)->get();
    
        return response()->json($playlists->load('creator'));
    }

    public function createPlaylist(Request $request)
    {
        $playlist = new Playlist;
        
        if ($request->name) {
            $playlist->name = $request->name;
        } else {
            $count = Playlist::where('creator_id', auth()->id())->count();
            $playlist->name = 'Playlist #' . ($count + 1);
        }
        
        $playlist->creator_id = auth()->id();
        $playlist->save();
    
        return response()->json(['message' => 'Playlist created successfully','id' => $playlist->id]);
    }

    public function destroy($id)
    {
        $playlist = Playlist::find($id);
    
        if (!$playlist) {
            return response()->json(['message' => 'Playlist not found'], 404);
        }
    
        if (auth()->id() !== $playlist->creator_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $playlist->delete();
    
        return response()->json(['message' => 'Playlist deleted successfully']);
    }

    public function addSongToPlaylist(Playlist $playlist, Song $song)
    {
        if (auth()->id() !== $playlist->creator_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        if ($playlist->songs()->where('songs.id', $song->id)->exists()) {
            return response()->json(['message' => 'Song already in playlist'], 409);
        }
    
        $playlist->songs()->attach($song->id);
    
        return response()->json(['message' => 'Song added to playlist']);
    }

    public function removeSongFromPlaylist(Playlist $playlist, Song $song)
    {

        if (auth()->id() !== $playlist->creator_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$playlist->songs()->where('songs.id', $song->id)->exists()) {
            return response()->json(['message' => 'Song not found in playlist'], 404);
        }
    
        $playlist->songs()->detach($song->id);
    
        return response()->json(['message' => 'Song removed from playlist']);
    }
}
