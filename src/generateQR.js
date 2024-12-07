import QRCode from 'qrcode';
import { writeFile } from 'fs/promises';

const url = 'http://localhost:5173/';

async function generateQR() {
  try {
    await QRCode.toFile('qrcode.png', url, {
      width: 300, // Tamaño del QR
      errorCorrectionLevel: 'H', // Alta corrección de errores
    });
    console.log('Código QR generado: qrcode.png');
  } catch (err) {
    console.error('Error generando el código QR:', err);
  }
}

generateQR();
