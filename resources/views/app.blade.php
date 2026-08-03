<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @php
            if (request()->isSecure()) {
                \Illuminate\Support\Facades\Vite::useHotFile(storage_path('framework/vite.hot.disabled'));
            }
        @endphp

        <!-- Scripts -->
        @routes
        @if (!request()->isSecure())
            @viteReactRefresh
        @endif
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
        
        @if(config('app.hide_cursor') && (request()->routeIs('kiosk-screen-saver') || request()->is('kiosk') || request()->is('kiosk/*')))
            <style>
                body {
                    cursor: none !important;
                }
            </style>
        @endif
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

