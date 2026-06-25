# ESC/POS Printer Setup Guide

## Quick Setup

### 1. Install Library
```bash
cd backend
./install-printer.sh
```

Or manually:
```bash
cd backend
composer require mike42/escpos-php
```

### 2. Configure Environment
Edit `backend/.env`:
```env
PRINTING_ENABLED=true
PRINTER_PATH=/dev/usb/lp0
```

### 3. Set Permissions (Linux)
```bash
# Check printer device
ls -la /dev/usb/lp*

# Set permissions
sudo chmod 666 /dev/usb/lp0

# Add web server user to lp group
sudo usermod -a -G lp www-data

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

### 4. Test Printer
```bash
# Simple test
echo "Test Print" > /dev/usb/lp0

# PHP test
php artisan tinker
>>> $service = new \App\Services\ReceiptPrinterService();
>>> $service->testPrinter();
```

## Printer Path Detection

### Linux
```bash
# List USB printers
ls -la /dev/usb/lp*

# Check printer status
lpstat -p -d

# View printer info
lsusb | grep -i printer
```

Common paths:
- `/dev/usb/lp0` - First USB printer
- `/dev/usb/lp1` - Second USB printer

### Windows
Common paths:
- `LPT1` - Parallel port
- `COM1` - Serial port

## Troubleshooting

### Issue: Permission Denied
```bash
# Check current permissions
ls -la /dev/usb/lp0

# Fix: Set world-writable (temporary)
sudo chmod 666 /dev/usb/lp0

# Fix: Add user to lp group (permanent)
sudo usermod -a -G lp www-data
sudo systemctl restart php8.2-fpm
```

### Issue: Printer Not Found
```bash
# Check if printer is connected
lsusb

# Check if device exists
ls -la /dev/usb/

# Reload USB devices
sudo udevadm trigger
```

### Issue: Printing Garbled Text
- Check printer model compatibility (ESC/POS)
- Verify character encoding
- Test with simple text first

### Issue: Nothing Prints
```bash
# Check printer status
lpstat -p

# Check if printer is online
lpstat -t

# Test direct printing
echo "Test" > /dev/usb/lp0
```

## Development Mode

Disable printing during development:
```env
PRINTING_ENABLED=false
```

## Printer Compatibility

### Supported Printers
- Epson TM series (TM-T20, TM-T82, TM-T88)
- Star Micronics (TSP100, TSP650)
- Bixolon (SRP-350, SRP-275)
- Any ESC/POS compatible thermal printer

### Paper Size
- 80mm thermal paper (standard)
- 40 characters per line

## Testing Receipt

After setup, test by:
1. Open kiosk frontend
2. Add items to cart
3. Proceed to checkout
4. Select payment method
5. Receipt should print automatically

## Logs

Check printing logs:
```bash
tail -f backend/storage/logs/laravel.log | grep "Receipt"
```

## Production Checklist

- [ ] Printer connected via USB
- [ ] Printer path configured in .env
- [ ] Permissions set correctly
- [ ] Test print successful
- [ ] Printing enabled in .env
- [ ] Logs show no errors
- [ ] Receipt format matches sample
- [ ] Paper loaded and ready

## Support

For issues:
1. Check logs: `backend/storage/logs/laravel.log`
2. Test printer connection: `echo "Test" > /dev/usb/lp0`
3. Verify permissions: `ls -la /dev/usb/lp0`
4. Check printer status: `lpstat -p`

## Additional Resources

- mike42/escpos-php documentation: https://github.com/mike42/escpos-php
- ESC/POS command reference: https://reference.epson-biz.com/modules/ref_escpos/
