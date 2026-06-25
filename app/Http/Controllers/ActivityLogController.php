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
    $logs = ActivityLog::orderBy('created_at', 'desc')->paginate(50);

    return response()->json([
        'data' => $logs->items(),
        'meta' => [
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
        ],
    ]);
}
}