<?php

namespace App\Http\Controllers;

use App\Models\Videocast;
use Illuminate\Http\Request;

class VideocastController extends Controller
{
    public function index()
    {
        $videocasts = Videocast::all();
        return view('videocasts.index', compact('videocasts'));
    }

    public function create()
    {
        return view('videocasts.create');
    }

    public function store(Request $request)
    {
        $videocast = Videocast::create($request->all());
        return redirect()->route('videocasts.index');
    }

    public function show(Videocast $videocast)
    {
        return view('videocasts.show', compact('videocast'));
    }

    public function edit(Videocast $videocast)
    {
        return view('videocasts.edit', compact('videocast'));
    }

    public function update(Request $request, Videocast $videocast)
    {
        $videocast->update($request->all());
        return redirect()->route('videocasts.index');
    }

    public function destroy(Videocast $videocast)
    {
        $videocast->delete();
        return redirect()->route('videocasts.index');
    }

    // EPISODE RELATED

    public function indexEpisode(Videocast $videocast)
    {
        $episodes = $videocast->episodes;
        return view('videocasts.episodes.index', compact('episodes'));
    }

    public function createEpisode(Videocast $videocast)
    {
        return view('videocasts.episodes.create', compact('videocast'));
    }

    public function storeEpisode(Request $request, Videocast $videocast)
    {
        $episode = new VideocastEpisode($request->all());
        $videocast->episodes()->save($episode);
        return redirect()->route('videocasts.episodes.index', $videocast);
    }
}