// import axios from "axios";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

//Utility Functions :

const priceCalculator = (rooms, startDate, endDate) => {
  let total = 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  // Calculate the number of days between startDate and endDate
  let numDays = (end - start) / (1000 * 3600 * 24) + 1;

  if (numDays <= 0) {
    console.error("Invalid date range");
    return 0;
  }

  if (!Array.isArray(rooms) || rooms.length === 0) {
    return 0;
  }

  rooms.forEach((room) => {
    if (room && room.price) {
      total += room.price * numDays;
    } else {
      console.error("Invalid room data:", room);
    }
  });

  return total === 1 ? 0 : total;
};


const getInvoicePDF = async (elementRef, invoiceNumber) => {
  const element = elementRef.current;
  if (!element) {
    console.error("Element not found.");
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const imgWidth = pdf.internal.pageSize.getWidth(); // A4 page width
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`INVOICE_${invoiceNumber}.pdf`);
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
};

export { priceCalculator, getInvoicePDF };