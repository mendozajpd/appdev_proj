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
    
    protected $songPath;
    protected $albumId;
    protected $displayName;
    protected $hashedSongName;

    public function __construct($songPath, $albumId, $displayName, $hashedSongName)
    {
        $this->songPath = $songPath;
        $this->albumId = $albumId;
        $this->displayName = $displayName;
        $this->hashedSongName = $hashedSongName;
    }

    public function handle()
    {
        $song = new Song;
        $song->display_name = $this->displayName;
        $song->hashed_name = $this->hashedSongName;
        $song->user_id = auth()->id();
        $song->album_id = $this->albumId;
        $song->save();
    }
}
