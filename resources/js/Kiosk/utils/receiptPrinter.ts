import { Cart } from '@/Kiosk/types/cart-types';

const RECEIPT_WIDTH = 40;

const centerText = (text: string): string => {
  const padding = Math.max(0, Math.floor((RECEIPT_WIDTH - text.length) / 2));
  return `${' '.repeat(padding)}${text}`;
};

const formatLine = (left: string, right: string): string => {
  const spacing = Math.max(1, RECEIPT_WIDTH - left.length - right.length);
  return `${left}${' '.repeat(spacing)}${right}`;
};

const formatReceiptDateTime = (value?: string): string => {
  const date = value ? new Date(value) : new Date();
  const fallback = new Date();
  const safeDate = Number.isNaN(date.getTime()) ? fallback : date;

  return safeDate.toLocaleString('en-PH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export const generateReceiptFromCart = (cart: Cart): string => {
  const lines: string[] = [];
  const separator = '-'.repeat(RECEIPT_WIDTH);
  const totalItems = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.cart_items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  lines.push(centerText('H&F DEPARTMENT STORE'));
  lines.push(centerText('ALTURAS KIOSK'));
  lines.push(centerText('ORDER RECEIPT'));
  lines.push('');
  lines.push(formatLine('ORDER NO.', cart.cart_number));
  lines.push(formatLine('DATE', formatReceiptDateTime(cart.updated_at ?? cart.created_at)));
  lines.push(separator);

  cart.cart_items.forEach((item) => {
    const itemName = item.color ? `${item.name} (${item.color})` : item.name;

    lines.push(itemName);
    lines.push(
      formatLine(
        `  ${item.quantity} x ${Number(item.price).toFixed(2)}`,
        Number(item.subtotal).toFixed(2)
      )
    );
  });

  lines.push(separator);
  lines.push(formatLine('TOTAL ITEMS', `${totalItems}`));
  lines.push(formatLine('TOTAL AMOUNT', totalAmount.toFixed(2)));
  lines.push(separator);
  lines.push(centerText('Thank you for your order!'));
  lines.push('');
  lines.push('');

  return lines.join('\n');
};

export const printReceipt = (receiptContent: string): void => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error('Unable to open receipt printer.');
  }

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Alturas Receipt</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 5mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            white-space: pre-wrap;
          }

          @media print {
            body {
              margin: 0;
              padding: 5mm;
            }
          }
        </style>
      </head>
      <body>${escapeHtml(receiptContent)}</body>
    </html>
  `);
  iframeDoc.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 1000);
    }, 250);
  };
};
