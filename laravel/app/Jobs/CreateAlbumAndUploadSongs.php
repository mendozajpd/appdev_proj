<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateAlbumAndUploadSongs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // Album creation
        $this->request->validate([
            'album_name' => 'required',
            'album_description' => 'required',
            'album_photo' => 'required|file|mimes:jpeg,png,jpg,gif',
            'release_date' => 'nullable|date',
        ]);

        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $photoExtension = $this->request->file('album_photo')->getClientOriginalExtension();
        $hashedPhotoName = $hashedTime . '.' . $photoExtension;

        $album = new Album;
        $album->album_name = $this->request->album_name;
        $album->album_description = $this->request->album_description;
        $album->cover_photo_hash = $hashedPhotoName;
        $album->user_id = auth()->id();
        $album->is_published = $this->request->is_published;
        $album->release_date = $this->request->release_date;

        $this->request->file('album_photo')->storeAs('album_images', $hashedPhotoName, 'public');

        $album->save();

        // Song uploading
        foreach ($this->request->songs as $songRequest) {
            $songRequest->validate([
                'display_name' => 'required',
                'song' => 'required|file|mimes:mp3,wav,ogg|max:40000',
            ]);

            $currentTime = time();
            $hashedTime = hash('sha256', $currentTime);
            $songExtension = $songRequest->file('song')->getClientOriginalExtension();
            $hashedSongName = $hashedTime . '.' . $songExtension;
            $songRequest->file('song')->storeAs('songs', $hashedSongName, 'public');

            $song = new Song;
            $song->display_name = $songRequest->display_name;
            $song->hashed_name = $hashedSongName;
            $song->user_id = auth()->id();
            $song->album_id = $album->id; 

            $song->save();
        }

        return response()->json(['message' => 'Album and songs created successfully'], 201);
    }
}
