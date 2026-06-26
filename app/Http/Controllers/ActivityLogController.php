<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\ActivityLog;


class ActivityLogController extends Controller {

    public function page() {
        return Inertia::render('Admin/UserLogs');
    }
    
   public function list() {
    $logs = ActivityLog::orderBy('id', 'desc')->get();

        return response()->json([
            'data' => $logs,
        ]);
    }
}