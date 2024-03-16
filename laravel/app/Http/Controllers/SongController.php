<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class SongController extends Controller
{
    public function getSong($filename)
    {
        $path = storage_path('app/public/songs/' . $filename);
    
        // Log the file path
        Log::info('File path: ' . $path);
    
        $file = File::get($path);
        $type = File::mimeType($path);
    
        $headers = array(
            'Content-Type' => $type,
            'Content-Disposition' => 'inline; filename="'.$filename.'"'
        );
    
        // Log the headers
        Log::info('Headers: ', $headers);
    
        return Response::stream(function() use($path) {
            $stream = fopen($path, 'r');
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, $headers);
    }
}
