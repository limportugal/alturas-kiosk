<?php

namespace App\Services;

use App\Models\Cart\CartModel;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Mike42\Escpos\CapabilityProfile;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\Printer;

class ReceiptPrinterService
{
    private string $printerPath;

    private string $printerConnector;

    private string $printerName;

    private string $capabilityProfile;

    private int $receiptWidth;

    public function __construct()
    {
        $this->printerPath = (string) config('printing.printer_path', '/dev/usb/lp0');
        $this->printerConnector = (string) config('printing.connector', 'file');
        $this->printerName = (string) config('printing.printer_name', '');
        $this->capabilityProfile = (string) config('printing.capability_profile', 'simple');
        $this->receiptWidth = (int) config('printing.receipt_width', 40);
    }

    public function printConfirmedCart(CartModel $cart): bool
    {
        try {
            if (!config('printing.enabled', true)) {
                \Log::info('Receipt printing disabled', ['cart_id' => $cart->id]);
                return true;
            }

            $receiptData = $this->buildReceiptDataFromCart($cart);
            $printer = $this->makePrinter();

            $this->printReceiptDocuments($printer, $receiptData);

            return true;
        } catch (\Throwable $e) {
            \Log::error('Cart receipt printing failed', [
                'cart_id' => $cart->id,
                'cart_number' => $cart->cart_number,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    private function makePrinter(): Printer
    {
        if ($this->printerConnector === 'windows') {
            if ($this->printerName === '') {
                throw new \RuntimeException('PRINTER_NAME is required for Windows printing.');
            }

            $profile = CapabilityProfile::load($this->capabilityProfile);
            $connector = new WindowsPrintConnector($this->printerName);

            return new Printer($connector, $profile);
        }

        $connector = new FilePrintConnector($this->printerPath);
        return new Printer($connector);
    }

    private function buildReceiptDataFromCart(CartModel $cart): array
    {
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
            'receiptNo' => $this->generateReceiptNumber($cart),
            'txnNumber' => $this->generateTransactionNumber($cart),
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
        ];
    }

    private function generateReceiptNumber(CartModel $cart): string
    {
        return now()->format('ymd') . str_pad((string) $cart->id, 6, '0', STR_PAD_LEFT);
    }

    private function generateTransactionNumber(CartModel $cart): string
    {
        return now()->format('His') . str_pad((string) $cart->id, 4, '0', STR_PAD_LEFT);
    }

    private function printReceiptDocuments(Printer $printer, array $receiptData): void
    {
        $this->printOrderSlip($printer, $receiptData);

        $printer->feed(2);
        $printer->cut(Printer::CUT_PARTIAL);
        $printer->feed(1);

        $this->printFullReceipt($printer, $receiptData);
        $printer->feed(3);
        $printer->cut();
        $printer->close();
    }

    private function printOrderSlip(Printer $printer, array $receiptData): void
    {
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->setEmphasis(true);
        $printer->text($this->centerText((string) config('printing.company_name', 'H&F DEPARTMENT STORE')));
        $printer->setEmphasis(false);
        $printer->text($this->centerText((string) config('printing.store_name', 'ALTURAS KIOSK')));
        $printer->text($this->centerText('ORDER SLIP'));
        $printer->feed();

        $printer->setTextSize(2, 2);
        $printer->text("ORDER NO.\n");
        $printer->text($receiptData['orderSlipNo'] . "\n");
        $printer->setTextSize(1, 1);
        $printer->feed();

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

    private function printFullReceipt(Printer $printer, array $receiptData): void
    {
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->setEmphasis(true);
        $printer->text($this->centerText((string) config('printing.company_name', 'H&F DEPARTMENT STORE')));
        $printer->setEmphasis(false);
        $printer->text($this->centerText((string) config('printing.store_name', 'ALTURAS KIOSK')));
        $printer->text($this->centerText('ORDER RECEIPT'));
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
        $printer->text($this->centerText($receiptData['footerMessage']));
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
}
