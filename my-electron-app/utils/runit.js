import generateInvoicePDF from './GenerateInvoice.js'; // Adjust the path as necessary

const testData = {
  Name: "John Doe",
  Phone: "1234567890",
  Address: "123 Main St, Anytown, USA",
  invoiceNo: "001",
  Date: "01/01/2023",
  Rooms: [
    { roomNumber: "101", type: "Single", price: 1000 },
    { roomNumber: "102", type: "Double", price: 1500 },
  ],
  Amount: 2500
};

generateInvoicePDF(testData)
  .then(() => console.log('Test invoice generated successfully'))
  .catch(err => console.error('Error generating test invoice:', err));