<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtistRequestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\SongController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\ListenController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\VideocastController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

// AuthController Routes
Route::get('role', [AuthController::class, 'getRole']);
Route::post('login', [AuthController::class, 'login']); // Check role, then redirect accordingly
Route::post('register-listener', [AuthController::class, 'registerListener']);
Route::post('register-artist', [AuthController::class, 'registerArtist']);
Route::post('resend-verification-email', [AuthController::class, 'sendVerificationEmail']);

// UserController Routes
Route::get('users', [UserController::class, 'getUsers']);
Route::get('users/{id}', [UserController::class, 'getUser']);
Route::put('users/{id}', [UserController::class, 'updateUser']);
Route::delete('users/{id}', [UserController::class, 'deleteUser']);

// ArtistRequestController Routes
Route::get('artist-requests', [ArtistRequestController::class, 'getArtistRequests']);

// ArtistController Routes
Route::get('artist-count', [ArtistController::class, 'getArtistCount']);
Route::get('/song/{id}/album', [ArtistController::class, 'getAlbumOfSong']);
Route::get('albums', [ArtistController::class, 'getAlbums']);
Route::get('artists', [ArtistController::class, 'getArtists']);
Route::get('/artists/{id}', [ArtistController::class, 'getArtist']);
Route::get('/songs/{id}', [ArtistController::class, 'getArtistSongs']);
Route::get('/album/{id}/details', [ArtistController::class, 'getAlbumWithSongs']);
Route::get('/albums/{id}', [ArtistController::class, 'getArtistAlbums']);
Route::post('upload-song', [ArtistController::class, 'uploadSong']);
Route::post('create/album', [ArtistController::class, 'createAlbum']);
Route::post('create/album/upload-songs', [ArtistController::class, 'createAlbumAndUploadSongs']);
Route::delete('songs/{id}', [ArtistController::class, 'deleteSong']);
Route::put('albums/{id}', [ArtistController::class, 'editAlbum']);
Route::put('songs/{id}', [ArtistController::class, 'editSong']);

// ListenController Routes
Route::post('listen/{song}', [ListenController::class, 'listen']);
Route::get('most-listened-artist/{limit}', [ListenController::class, 'mostListenedArtist']);
Route::get('most-listened-song/{limit}', [ListenController::class, 'mostListenedSong']);
Route::get('most-listened-song-of-artist/{artistId}/{limit}', [ListenController::class, 'mostListenedSongOfArtist']);

// SongController Routes
Route::get('/play/{filename}', [SongController::class, 'getSong']);
Route::get('songs', [SongController::class, 'getSongs']);
Route::get('song-details/{id}', [SongController::class, 'getSongDetails']);
Route::get('genres', [SongController::class, 'getGenres']);

// PlaylistController Routes
Route::get('playlist/{id}', [PlaylistController::class, 'getPlaylist']);
Route::get('playlists', [PlaylistController::class, 'getPlaylists']);
Route::post('create-playlist', [PlaylistController::class, 'createPlaylist']);
Route::get('playlist/{id}/songs', [PlaylistController::class, 'getPlaylistSongs']);
Route::post('playlist/{playlist}/{song}/add', [PlaylistController::class, 'addSongToPlaylist']);
Route::delete('playlist/{playlist}/{song}/remove', [PlaylistController::class, 'removeSongFromPlaylist']);
Route::delete('playlist/{id}/delete', [PlaylistController::class, 'destroy']);

// PodcastController Routes
Route::get('podcasts', [PodcastController::class, 'index']);
Route::get('podcasts/user', [PodcastController::class, 'indexUserPodcasts']);
Route::get('podcasts/{id}', [PodcastController::class, 'show']);
Route::post('podcasts', [PodcastController::class, 'store']);
Route::put('podcasts/{podcast}', [PodcastController::class, 'update']);
Route::delete('podcasts/{podcast}', [PodcastController::class, 'destroy']);
// Podcast Episode
Route::get('podcasts/{podcast}/episodes', [PodcastController::class, 'indexEpisode']);
Route::post('podcasts/{podcast}/episodes', [PodcastController::class, 'storeEpisode']);
Route::put('podcasts/{podcast}/episodes/{episode}', [PodcastController::class, 'updateEpisode']);
Route::delete('podcasts/{podcast}/episodes/{episode}', [PodcastController::class, 'destroyEpisode']);

// VideocastController Routes
Route::get('videocasts', [VideocastController::class, 'index']);
Route::get('videocasts/{videocast}', [VideocastController::class, 'show']);
Route::post('videocasts', [VideocastController::class, 'store']);
Route::put('videocasts/{videocast}', [VideocastController::class, 'update']);
Route::delete('videocasts/{videocast}', [VideocastController::class, 'destroy']);


Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

    // Artist

    
    Route::get('email/verify/{id}', function (Request $request, $id) {
        $user = App\Models\User::find($id);

        if (!$user) {
            abort(404);
        }

        $user->markEmailAsVerified();

        return redirect(env('FRONT_END_URL') . '/home');
    })->name('verification.verify');
});



