<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('resend-verification-email', [AuthController::class, 'sendVerificationEmail']);

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::get('email/verify/{id}', function (Request $request, $id) { // $id is $token
        $user = App\Models\User::find($id);
        // $user = App\Models\User::where('verification_token', $token)->first();

        if (!$user) {
            abort(404);
        }

        $user->markEmailAsVerified();

        return redirect('http://localhost:3000/home');
    })->name('verification.verify');
});