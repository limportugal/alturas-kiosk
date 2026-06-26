<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Enable Printing
    |--------------------------------------------------------------------------
    */
    'enabled' => env('PRINTING_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Printer Path
    |--------------------------------------------------------------------------
    */
    'printer_path' => env('PRINTER_PATH', '/dev/usb/lp0'),

    /*
    |--------------------------------------------------------------------------
    | Printer Connector
    |--------------------------------------------------------------------------
    |
    | file    = direct device path like /dev/usb/lp0, LPT1, COM1
    | windows = Windows print queue / shared printer via WindowsPrintConnector
    |
    */
    'connector' => env('PRINTER_CONNECTOR', PHP_OS_FAMILY === 'Windows' ? 'windows' : 'file'),

    /*
    |--------------------------------------------------------------------------
    | Windows Printer Name
    |--------------------------------------------------------------------------
    |
    | Example: smb://localhost/EPSON_TM_T82
    |
    */
    'printer_name' => env('PRINTER_NAME', ''),

    /*
    |--------------------------------------------------------------------------
    | Printer Capability Profile
    |--------------------------------------------------------------------------
    */
    'capability_profile' => env('PRINTER_CAPABILITY_PROFILE', 'simple'),

    /*
    |--------------------------------------------------------------------------
    | Receipt Width
    |--------------------------------------------------------------------------
    */
    'receipt_width' => (int) env('RECEIPT_WIDTH', 42),

    /*
    |--------------------------------------------------------------------------
    | Store Labels
    |--------------------------------------------------------------------------
    */
    'store_name' => env('RECEIPT_STORE_NAME', 'ALTURAS KIOSK'),
    'company_name' => env('RECEIPT_COMPANY_NAME', 'H&F DEPARTMENT STORE'),
    'footer_message' => env('RECEIPT_FOOTER_MESSAGE', 'Thank you for your order!'),

    /* 
    |--------------------------------------------------------------------------
    | Printing Options
    |--------------------------------------------------------------------------
    */
    'partial_cut' => env('PRINTER_PARTIAL_CUT', 'ON'),
];
