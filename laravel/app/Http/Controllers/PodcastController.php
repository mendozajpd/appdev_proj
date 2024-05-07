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
        try {
            $episodes = $podcast->episodes;
            return response()->json($episodes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve episodes', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function storeEpisode(Request $request, Podcast $podcast)
    {
        try {
            $episode = new PodcastEpisode($request->all());
            $podcast->episodes()->save($episode);
            return response()->json($episode, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create episode', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateEpisode(Request $request, Podcast $podcast, PodcastEpisode $episode)
    {
        try {
            $episode->update($request->all());
            return response()->json($episode);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update episode', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroyEpisode(Podcast $podcast, PodcastEpisode $episode)
    {
        try {
            $episode->delete();
            return response()->json(['message' => 'Episode deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete episode', 'message' => $e->getMessage()], 500);
        }
    }
}