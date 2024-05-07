<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideocastEpisode extends Model
{
    use HasFactory;

    protected $fillable = ['display_name', 'hashed_name', 'description', 'videocast_id', 'user_id'];
    
    public function videocast()
    {
        return $this->belongsTo(Videocast::class, 'videocast_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function listens()
    {
        return $this->hasMany(Listen::class);
    }
    
    public function playlists()
    {
        return $this->belongsToMany(Playlist::class);
    }
}
