import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

const generateInvoicePDF = async (data) => {
  const { Name="Amrit Dey", Phone="9411164084", Address="Kharkhari Haridwar", invoiceNo="999", Date="26/11/2012", Rooms, Amount } = data;

  // Create a new PDF Document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add Header
  page.drawText('TELUGU SATRAM ROOMS', { x: 50, y: 750, size: 18, font, color: rgb(0, 0, 0) });
  page.drawText('Pracheen Ram Mandir, Bhupatwala, Haridwar', { x: 50, y: 730, size: 12, font });
  page.drawText('Contact: 9634717899', { x: 50, y: 710, size: 12, font });

  // Invoice Details
  page.drawText(`Invoice No: ${invoiceNo}`, { x: 400, y: 750, size: 12, font });
  page.drawText(`Date: ${"This is date"}`, { x: 400, y: 730, size: 12, font });

  // Customer Details
  page.drawText(`Bill To: ${Name}`, { x: 50, y: 680, size: 12, font });
  page.drawText(`Phone: ${Phone}`, { x: 50, y: 660, size: 12, font });
  page.drawText(`Address: ${Address}`, { x: 50, y: 640, size: 12, font });

  // Items Table Header
  page.drawText('#', { x: 50, y: 600, size: 12, font });
  page.drawText('Room Number', { x: 100, y: 600, size: 12, font });
  page.drawText('Type', { x: 300, y: 600, size: 12, font });
  page.drawText('Price', { x: 400, y: 600, size: 12, font });
  // page.drawText('TOTAL', { x: 500, y: 600, size: 12, font });

  // Items Table Data
  let yPosition = 580;
  Rooms.forEach((room, index) => {
    page.drawText(`${index + 1}`, { x: 50, y: yPosition, size: 12, font });
    page.drawText(room.roomNumber, { x: 100, y: yPosition, size: 12, font });
    page.drawText(`${room.type}`, { x: 300, y: yPosition, size: 12, font });
    page.drawText(`${room.price}`, { x: 400, y: yPosition, size: 12, font });
  });

  // Total
  page.drawText(`Total: Rs${Amount}`, { x: 500, y: yPosition - 20, size: 12, font });

  // Bank Details
  page.drawText('Bank Details:', { x: 50, y: yPosition - 60, size: 12, font });
  page.drawText(`Account Holder: VASUDEVA SHARMA`, { x: 50, y: yPosition - 80, size: 12, font });
  page.drawText(`Account No: 34507406232`, { x: 50, y: yPosition - 100, size: 12, font });
  page.drawText(`IFSC: SBIN0012849`, { x: 50, y: yPosition - 120, size: 12, font });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(`../invoices/invoice_${invoiceNo}.pdf`, pdfBytes);
  console.log('Invoice PDF Generated');
};

export default generateInvoicePDF;
