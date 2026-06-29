#!/bin/bash
set -e

cd /var/www/html/alturas-kiosk

echo "==> Pulling latest code..."
git pull

echo "==> Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-scripts

echo "==> Building frontend..."
npm run build

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Clearing and rebuilding cache (needs sudo)..."
sudo rm -f bootstrap/cache/packages.php bootstrap/cache/services.php bootstrap/cache/config.php
sudo php artisan package:discover --ansi
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache

echo "==> Fixing permissions..."
sudo chown -R www-data:www-data bootstrap/cache storage
sudo chmod -R 775 bootstrap/cache storage

echo "==> Done!"
