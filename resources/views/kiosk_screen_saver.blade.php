<!DOCTYPE html>
<html lang="en" style="height: 100%; margin: 0; padding: 0;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alturas Kiosk</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #000; }
        #app { width: 100%; height: 100%; }
    </style>
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/Kiosk-Screen-Saver/Kiosk.tsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
