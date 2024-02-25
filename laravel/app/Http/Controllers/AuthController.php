<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;
use App\Http\Controllers\Controller;

use App\Mail\ContactFormMail;
use App\Mail\VerificationEmail;

class AuthController extends Controller 
{

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function registerListener(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:4|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase() // allows both uppercase and lowercase
                    ->letters() //accepts letter
                    ->numbers() //accepts numbers
                    // ->symbols() //accepts special character
                    // ->uncompromised(), //check to be sure that there is no data leak
            ],
            'confirmPassword' => 'required|same:password'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'listener';
        $user->save();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', now()->addMinutes(60), ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerificationEmail($verificationUrl,$user->name));

        
        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function registerArtist(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:4|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase() // allows both uppercase and lowercase
                    ->letters() //accepts letter
                    ->numbers() //accepts numbers
                    // ->symbols() //accepts special character
                    // ->uncompromised(), //check to be sure that there is no data leak
            ],
            'confirmPassword' => 'required|same:password'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'artist';
        $user->save();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', now()->addMinutes(60), ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerificationEmail($verificationUrl,$user->name)); 
        // send email for verification
        // send another email after verification for pending approval

        
        return response()->json(['message' => 'User registered successfully'], 201);
    }
    
    public function sendVerificationEmail(Request $request) {
        $user = auth()->user();
            
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', now()->addMinutes(60), ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerificationEmail($verificationUrl,$user->name));

        return response()->json(['message' => 'Email sent successfully'], 201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
