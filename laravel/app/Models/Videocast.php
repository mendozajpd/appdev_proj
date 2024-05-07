<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Videocast extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $fillable = ['name', 'description', 'user_id'];

    public function episodes()
    {
        return $this->hasMany(VideocastEpisode::class, 'videocast_id', 'id');
    }

    public function user()
    {
    return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
