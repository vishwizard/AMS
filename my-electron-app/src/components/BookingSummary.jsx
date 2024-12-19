const BookingSummary = ({ customer, bookingDetails, onFinish }) => (
    <div className="booking-summary">
      <h2>Booking Summary</h2>
      <p><strong>Customer:</strong> {customer.name}</p>
      <p><strong>Check-In:</strong> {bookingDetails.checkInDate}</p>
      <p><strong>Check-Out:</strong> {bookingDetails.checkOutDate}</p>
      <p><strong>Rooms:</strong> {bookingDetails.rooms.join(', ')}</p>
      <button onClick={onFinish}>Finish Booking</button>
    </div>
  );
  
  export default BookingSummary;
  