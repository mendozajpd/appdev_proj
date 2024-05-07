<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use App\Models\PodcastEpisode;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PodcastController extends Controller
{
    public function index()
    {
        $podcasts = Podcast::all();
        return response()->json($podcasts);
    }

    public function indexUserPodcasts()
    {
        $user = auth()->user();
        $podcasts = $user->podcasts;
        return response()->json($podcasts);
    }

    public function store(Request $request)
    {
        $podcast = Podcast::create($request->all());
        return response()->json($podcast);
    }

    public function show($id)
    {
        try {
            $podcast = Podcast::findOrFail($id);
            return response()->json($podcast);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Podcast not found'], 404);
        }
    }

    public function update(Request $request, Podcast $podcast)
    {
        $podcast->update($request->all());
        return response()->json($podcast);
    }

    public function destroy(Podcast $podcast)
    {
        $podcast->delete();
        return response()->json(['message' => 'Podcast deleted']);
    }

    // EPISODE RELATED

    public function indexEpisode(Podcast $podcast)
    {
        $episodes = $podcast->episodes;
        return view('podcasts.episodes.index', compact('episodes'));
    }

    public function createEpisode(Podcast $podcast)
    {
        return view('podcasts.episodes.create', compact('podcast'));
    }

    public function storeEpisode(Request $request, Podcast $podcast)
    {
        $episode = new PodcastEpisode($request->all());
        $podcast->episodes()->save($episode);
        return redirect()->route('podcasts.episodes.index', $podcast);
    }
}