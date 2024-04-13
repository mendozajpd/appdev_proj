<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'creator_id'];
    
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function songs()
    {
        return $this->belongsToMany(Song::class, 'playlist_song')->withTimestamps();
    }
}
