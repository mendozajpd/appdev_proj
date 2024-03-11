<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\User;
use App\Models\Album;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ArtistController extends Controller
{

    public function getArtists(Request $request)
    {
        $artists = User::where('role', 'artist')->get();

        return response()->json($artists);
    }

    public function getAlbums(Request $request)
    {
        $user = auth()->user();
        $albums = $user->albums;

        return response()->json($albums);
    }
    
    public function getArtistSongs($id)
    {
        $user = User::find($id);
        if ($user) {
            $songs = $user->songs()->with('user')->get();
            return response()->json($songs);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function uploadSong(Request $request)
    {
        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'Image file is empty'], 400);
        }
        
        if (!$request->hasFile('song')) {
            return response()->json(['message' => 'Song file is empty'], 400);
        }

        $request->validate([
            'display_name' => 'required',
            'song' => 'required|file|mimes:mp3,wav,ogg',
            'image' => 'required|file|mimes:jpeg,png,jpg,gif', // validate the image file
            'new_album_name' => 'sometimes|required',
            'new_album_description' => 'sometimes|required',
            'new_album_photo' => 'sometimes|required|file|mimes:jpeg,png,jpg,gif',
        ]);

        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
    
        $songExtension = $request->file('song')->getClientOriginalExtension();
        $imageExtension = $request->file('image')->getClientOriginalExtension();
    
        $hashedSongName = $hashedTime . '.' . $songExtension;
        $hashedImageName = $hashedTime . '.' . $imageExtension;
    
        $request->file('song')->storeAs('songs', $hashedSongName, 'public');
        $request->file('image')->storeAs('images', $hashedImageName, 'public');
    
        $song = new Song;
        $song->display_name = $request->display_name;
        $song->hashed_name = $hashedSongName;
        $song->photo_hashed_name = $hashedImageName;
        $song->user_id = auth()->id();
        

        if ($request->has('new_album_name')) {
            $album = new Album;
            $album->album_name = $request->new_album_name;
            $album->album_description = $request->new_album_description;
            $album->photo_hashed_name = $request->file('new_album_photo')->hashName();
            $album->user_id = auth()->id();
    
            $request->file('new_album_photo')->storeAs('album_images', $album->photo_hashed_name);
    
            $album->save();
    
            $song->album_id = $album->id;
        } else {
            $song->album_id = $request->album_id;
        }
    
        $song->save();
    
        return response()->json(['message' => 'Song Uploaded Successfully'], 201);
    }

    public function deleteSong(Request $request, $id)
    {
        $song = Song::find($id);

        if ($song && auth()->id() == $song->user_id) {
            Storage::delete('songs/' . $song->hashed_name);
            $song->delete();
        }

        return response()->json(null, 204);
    }

    public function editAlbum(Request $request, $id)
    {
        $request->validate([
            'album_name' => 'required',
            'album_description' => 'required',
        ]);

        $album = Album::find($id);

        if ($album && auth()->id() == $album->user_id) {
            $album->album_name = $request->album_name;
            $album->album_description = $request->album_description;
            $album->save();
        }

        return response()->json($album);
    }

    public function editSong(Request $request, $id)
    {
        $request->validate([
            'display_name' => 'required',
        ]);

        $song = Song::find($id);

        if ($song && auth()->id() == $song->user_id) {
            $song->display_name = $request->display_name;
            $song->save();
        }

        return response()->json($song);
    }
}
