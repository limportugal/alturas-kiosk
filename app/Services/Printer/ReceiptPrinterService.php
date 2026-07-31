<?php

namespace App\Services\Printer;

use App\Models\Cart\CartModel;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\Printer;

class ReceiptPrinterService
{
    private int $receiptWidth;

    public function __construct()
    {
        $this->receiptWidth = (int) config('printing.receipt_width', 40);
    }

    // public function printConfirmedCart(CartModel $cart): void
    // {
    //     if (!config('printing.enabled', true)) {
    //         return;
    //     }

    //     $printer = $this->makePrinter();

    //     try {
    //         $receiptData = $this->buildReceiptDataFromCart($cart);

    //         $this->printOrderSlip($printer, $receiptData);

    //         $printer->feed(2);
    //         $printer->cut(Printer::CUT_PARTIAL);
    //         $printer->feed(1);

    //         $this->printFullReceipt($printer, $receiptData);
    //         $printer->feed(3);
    //         $printer->cut();
    //     } finally {
    //         $printer->close();
    //     }
    // }


    public function printConfirmedCart(CartModel $cart): void {
        \Log::info('printConfirmedCart called');
            \Log::info('Printing enabled?', [
    'enabled' => config('printing.enabled'),
]);
            if (!config('printing.enabled', true)) {
                return;
            }

            $printer = null;

            try {
                $printer = $this->makePrinter();
                $receiptData = $this->buildReceiptDataFromCart($cart);

                // Print Order Slip lang
                $this->printOrderSlip($printer, $receiptData);

                // $printer->feed(2);

                // if (config('printing.partial_cut')) {
                //     $printer->cut(Printer::CUT_PARTIAL);
                // } else {
                //     $printer->cut();
                // }

                // $printer->feed(1);

                // $this->printFullReceipt($printer, $receiptData);
                $printer->feed(3);
                $printer->cut();
            } catch (\Throwable $e) {
                \Log::error('Receipt printing failed', [
                    'cart_id' => $cart->id,
                    'cart_number' => $cart->cart_number,
                    'error' => $e->getMessage(),
                ]);
            } finally {
                if ($printer !== null) {
                    try {
                        $printer->close();
                    } catch (\Throwable $e) {
                        \Log::warning('Printer close failed', [
                            'cart_id' => $cart->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            }
        }

    private function makePrinter(): Printer {
        $connectorType = (string) config('printing.connector', 'file');
        $profileName = (string) config('printing.capability_profile', 'simple');
        $profile = CapabilityProfile::load($profileName);

        $connector = match ($connectorType) {
            'windows' => new WindowsPrintConnector((string) config('printing.printer_name')),
            default => new FilePrintConnector((string) config('printing.printer_path', '/dev/usb/lp0')),
        };

        return new Printer($connector, $profile);
    }

    private function buildReceiptDataFromCart(CartModel $cart): array {

        $timestamp = $cart->updated_at ?? $cart->created_at ?? now();
        $dateTime = $timestamp instanceof Carbon ? $timestamp : Carbon::parse($timestamp);

        $items = [];
        $total = 0.0;
        $totalItems = 0;

        foreach (($cart->cart_items ?? []) as $item) {
            $lineTotal = (float) ($item['subtotal'] ?? 0);
            $quantity = (int) ($item['quantity'] ?? 0);
            $unitPrice = (float) ($item['price'] ?? 0);

            $items[] = [
                'productName' => (string) ($item['name'] ?? 'Item'),
                'quantity' => $quantity,
                'price' => $unitPrice,
                'total' => $lineTotal,
                'color' => $item['color'] ?? null,
                'sku' => $item['sku'] ?? null,
            ];

            $total += $lineTotal;
            $totalItems += $quantity;
        }

        return [
            'orderSlipNo' => $cart->cart_number,
            'receiptNo' => now()->format('ymd') . str_pad((string) $cart->id, 6, '0', STR_PAD_LEFT),
            'txnNumber' => now()->format('His') . str_pad((string) $cart->id, 4, '0', STR_PAD_LEFT),
            'cashier' => 'KIOSK',
            'terminal' => 'T1',
            'shift' => 'S1',
            'orderType' => 'KIOSK',
            'status' => strtoupper((string) $cart->status),
            'dateTime' => $dateTime->format('m/d/y H:i'),
            'items' => $items,
            'total' => round($total, 2),
            'totalItems' => $totalItems,
            'footerMessage' => (string) config('printing.footer_message', 'Thank you for your order!'),
            'storeName' => (string) config('printing.store_name', 'ALTURAS KIOSK'),
            'companyName' => (string) config('printing.company_name', 'H&F DEPARTMENT STORE'),
        ];
    }


    
    // private function printOrderSlip(Printer $printer, array $receiptData): void {

      
    //     $printer->setEmphasis(true);
    //     $printer->setJustification(Printer::JUSTIFY_CENTER);
    //     $printer->text(trim($receiptData['companyName']) . "\n");
    //     $printer->setJustification(Printer::JUSTIFY_LEFT);
    //     $printer->setEmphasis(false);
    //     $printer->text($this->centerText($receiptData['storeName']));
    //     $printer->text($this->centerText('ORDER SLIP'));
    //     $printer->feed();

    //     $printer->setTextSize(2, 2);
    //     $printer->text("ORDER NO.\n");
    //     $printer->text($receiptData['orderSlipNo'] . "\n");
    //     $printer->setTextSize(1, 1);
    //     $printer->feed();

    //     $printer->setJustification(Printer::JUSTIFY_LEFT);
    //     $printer->text($this->formatLine('DATE', $receiptData['dateTime']));
    //     $printer->text($this->formatLine('STATUS', $receiptData['status']));
    //     $printer->text(str_repeat('-', $this->receiptWidth) . "\n");

    //     foreach ($receiptData['items'] as $item) {
    //         $label = $item['productName'];
    //         if (!empty($item['color'])) {
    //             $label .= ' (' . $item['color'] . ')';
    //         }

    //         $printer->text($item['quantity'] . 'x ' . Str::limit($label, $this->receiptWidth - 4, '') . "\n");
    //     }

    //     $printer->text(str_repeat('-', $this->receiptWidth) . "\n");
    //     $printer->text($this->formatLine('TOTAL ITEMS', (string) $receiptData['totalItems']));

    //     $printer->setJustification(Printer::JUSTIFY_CENTER);
    //     $printer->feed();
    //     $printer->text("THIS SLIP IS REQUIRED FOR CLAIMING.\n");
    // }

    // private function printFullReceipt(Printer $printer, array $receiptData): void {

    //     $printer->setJustification(Printer::JUSTIFY_CENTER);
    //     $printer->setEmphasis(true);
    //    $printer->setJustification(Printer::JUSTIFY_CENTER);
    //     $printer->text(trim($receiptData['companyName']) . "\n");
    //     $printer->setJustification(Printer::JUSTIFY_LEFT);
    //     $printer->setEmphasis(false);
    //     $printer->text($this->centerText($receiptData['storeName']));
    //     $printer->text($this->centerText('ORDER RECEIPT'));
    //     $printer->feed();

    //     $printer->setJustification(Printer::JUSTIFY_LEFT);
    //     $printer->text($this->formatLine('RECEIPT NO.', $receiptData['receiptNo']));
    //     $printer->text($this->formatLine('TXN NO.', $receiptData['txnNumber']));
    //     $printer->text($this->formatLine('ORDER NO.', $receiptData['orderSlipNo']));
    //     $printer->text($this->formatLine('DATE', $receiptData['dateTime']));
    //     $printer->text($this->formatLine('CASHIER', $receiptData['cashier']));
    //     $printer->text($this->formatLine('STATUS', $receiptData['status']));
    //     $printer->text(str_repeat('-', $this->receiptWidth) . "\n");

    //     foreach ($receiptData['items'] as $item) {
    //         $label = $item['productName'];
    //         if (!empty($item['color'])) {
    //             $label .= ' (' . $item['color'] . ')';
    //         }

    //         $printer->text(Str::limit($label, $this->receiptWidth, '') . "\n");
    //         $printer->text(
    //             $this->formatLine(
    //                 '  ' . $item['quantity'] . ' @ ' . number_format((float) $item['price'], 2),
    //                 number_format((float) $item['total'], 2)
    //             )
    //         );
    //     }

    //     $printer->text(str_repeat('-', $this->receiptWidth) . "\n");
    //     $printer->text($this->formatLine('TOTAL ITEMS', (string) $receiptData['totalItems']));

    //     $printer->setEmphasis(true);
    //     $printer->text($this->formatLine('TOTAL', number_format((float) $receiptData['total'], 2)));
    //     $printer->setEmphasis(false);

    //     $printer->text(str_repeat('-', $this->receiptWidth) . "\n");
    //     $printer->setJustification(Printer::JUSTIFY_CENTER);
    //     $printer->text($this->centerText($receiptData['footerMessage']));
    // }

    private function printOrderSlip(Printer $printer, array $receiptData): void {

      
        // $printer->setEmphasis(true);
        // $printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printCentered($printer, $receiptData['companyName'], true, true);
        // $printer->setJustification(Printer::JUSTIFY_LEFT);
        // $printer->setEmphasis(false);
        $this->printCentered($printer, $receiptData['storeName']);
        $this->printCentered ($printer,'ORDER SLIP', true, true);
        $printer->feed();

        $printer->setTextSize(2, 2);
        $printer->text("ORDER NO.\n");
        $printer->text($receiptData['orderSlipNo'] . "\n");
        $printer->setTextSize(1, 1);
        $printer->feed();

        // ===== BARCODE =====
        $printer->setBarcodeHeight(80);
        $printer->setBarcodeWidth(2);
        $printer->setBarcodeTextPosition(Printer::BARCODE_TEXT_NONE);
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        // Code 39 is supported by the printer's ESC/POS profile and accepts
        // the uppercase letters, digits, and hyphens in our CART-* numbers.
        $printer->barcode($receiptData['orderSlipNo'], Printer::BARCODE_CODE39);
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->feed(); 
        // =========================

        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text($this->formatLine('DATE', $receiptData['dateTime']));
        $printer->text($this->formatLine('STATUS', $receiptData['status']));
        $printer->text(str_repeat('-', $this->receiptWidth) . "\n");

        foreach ($receiptData['items'] as $item) {
            $label = $item['productName'];
            if (!empty($item['color'])) {
                $label .= ' (' . $item['color'] . ')';
            }

            $printer->text($item['quantity'] . 'x ' . Str::limit($label, $this->receiptWidth - 4, '') . "\n");
        }

        $printer->text(str_repeat('-', $this->receiptWidth) . "\n");
        $printer->text($this->formatLine('TOTAL ITEMS', (string) $receiptData['totalItems']));

        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->feed();
        $printer->text("THIS SLIP IS REQUIRED FOR CLAIMING.\n");
    }

    private function printFullReceipt(Printer $printer, array $receiptData): void {

   
        $this->printCentered($printer, $receiptData['companyName'], true, true);
        $this->printCentered($printer, $receiptData['storeName']);
        $this->printCentered($printer, 'ORDER RECEIPT', true, true);
        $printer->feed();

        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text($this->formatLine('RECEIPT NO.', $receiptData['receiptNo']));
        $printer->text($this->formatLine('TXN NO.', $receiptData['txnNumber']));
        $printer->text($this->formatLine('ORDER NO.', $receiptData['orderSlipNo']));
        $printer->text($this->formatLine('DATE', $receiptData['dateTime']));
        $printer->text($this->formatLine('CASHIER', $receiptData['cashier']));
        $printer->text($this->formatLine('STATUS', $receiptData['status']));
        $printer->text(str_repeat('-', $this->receiptWidth) . "\n");

        foreach ($receiptData['items'] as $item) {
            $label = $item['productName'];
            if (!empty($item['color'])) {
                $label .= ' (' . $item['color'] . ')';
            }

            $printer->text(Str::limit($label, $this->receiptWidth, '') . "\n");
            $printer->text(
                $this->formatLine(
                    '  ' . $item['quantity'] . ' @ ' . number_format((float) $item['price'], 2),
                    number_format((float) $item['total'], 2)
                )
            );
        }

        $printer->text(str_repeat('-', $this->receiptWidth) . "\n");
        $printer->text($this->formatLine('TOTAL ITEMS', (string) $receiptData['totalItems']));

        $printer->setEmphasis(true);
        $printer->text($this->formatLine('TOTAL', number_format((float) $receiptData['total'], 2)));
        $printer->setEmphasis(false);

        $printer->text(str_repeat('-', $this->receiptWidth) . "\n");
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $this->printCentered($printer, $receiptData['footerMessage']);
    }

    private function formatLine(string $left, string $right): string
    {
        $spacing = max(1, $this->receiptWidth - strlen($left) - strlen($right));
        return $left . str_repeat(' ', $spacing) . $right . "\n";
    }

    private function centerText(string $text): string
    {
        $text = trim($text);

        if (strlen($text) >= $this->receiptWidth) {
            return $text . "\n";
        }

        $padding = (int) floor(($this->receiptWidth - strlen($text)) / 2);
        return str_repeat(' ', max(0, $padding)) . $text . "\n";
    }

    private function printCentered(
            Printer $printer,
            string $text,
            bool $emphasis = false,
            bool $doubleStrike = false
        ): void {
            // Left justification para manual spacing ang susundin
            $printer->setJustification(Printer::JUSTIFY_LEFT);

            $printer->setEmphasis($emphasis);

            if ($doubleStrike && method_exists($printer, 'setDoubleStrike')) {
                $printer->setDoubleStrike(true);
            }

            // Important: ito dapat, hindi trim($text)
            $printer->text($this->centerText($text));

            if ($doubleStrike && method_exists($printer, 'setDoubleStrike')) {
                $printer->setDoubleStrike(false);
            }

            $printer->setEmphasis(false);
        }
}
