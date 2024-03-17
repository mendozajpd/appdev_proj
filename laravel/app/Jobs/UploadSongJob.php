<?php

namespace App\Jobs;

use function pathinfo;
use App\Models\Song;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class UploadSongJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    protected $albumId;

    public function __construct($songPath, $albumId)
    {
        $this->songPath = $songPath;
        $this->albumId = $albumId;
    }

    public function handle()
    {
        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $songExtension = pathinfo(Storage::url($this->songPath), PATHINFO_EXTENSION);
        $hashedSongName = $hashedTime . '.' . $songExtension;

        // Move the song from the temporary location to the final location
        Storage::move($this->songPath, 'songs/' . $hashedSongName);

        $song = new Song;
        $song->display_name = $this->displayName;
        $song->song_hashed_name = $hashedSongName;
        $song->user_id = auth()->id();
        $song->album_id = $this->albumId;
        $song->save();
    }
}
