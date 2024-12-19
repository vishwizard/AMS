// import React, { useState } from 'react';
import CustomerSearchForm from '../components/CustomerSearchForm';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';

const Bookings = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [customer, setCustomer] = useState('');
  const [bookings, setBookings] = useState([]);
  const [currBooking, setCurrBooking] = useState([]);
  const [step, setStep] = useState('start');
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'cash',
    transactionId: '',
    status: false
  });

  const initialStartDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(initialStartDate);  // Today's date

  const initialEndDate = (() => {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    return start.toISOString().split('T')[0];
  })();

  const [endDate, setEndDate] = useState(initialEndDate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchRoomData() {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/?startDate=${startDate}&endDate=${endDate}`);
      setRooms((prev) => response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookingData() {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/?startDate=${startDate}&endDate=${endDate}`);
      console.log(response.data.data);
      setBookings(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBookingData();
  }, []);
  const priceCalculator = () => {
    let total = 0;

    // Convert the startDate and endDate from string to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Calculate the number of days between startDate and endDate
    let numDays = (end - start) / (1000 * 3600 * 24) + 1; // +1 to include both start and end day
    // console.log("Number of Days:", numDays);

    if (numDays <= 0) {
      console.error("Invalid date range");
      return 0;
    }

    // If no valid rooms, return 0
    if (!Array.isArray(selectedRooms) || selectedRooms.length === 0) {
      // console.error("No rooms selected");
      return 0;
    }

    // Calculate total price
    selectedRooms.forEach((room) => {
      if (room && room.price) {
        total += room.price * numDays;
      } else {
        console.error("Invalid room data:", room);
      }
    });

    return total === 1 ? 0 : total;
  };

  const data = {
    name: customer.Name,
    amount: priceCalculator(),
    number: customer.Phone,
    MUID: "MUID" + Date.now(),
    transactionId: 'T' + Date.now(),
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/payment', { ...data });
      if (response) {
        window.location.href = response.data;
      } else {
        console.error('payment link not found');
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function formatDateToDDMMYYYY(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }


  const addBooking = async () => {
    try {
      const selectedRoomIds = selectedRooms.map((room) => room._id);
      const data = {
        Customer: customer._id,
        Rooms: selectedRoomIds,
        CheckIn: startDate,
        CheckOut: endDate,
        PaymentDetails: paymentDetails,
        Amount: priceCalculator()
      };
      const response = await axios.post('http://localhost:5000/api/bookings', data);
      setCurrBooking(response.data.data);
    } catch (err) {
      console.log(err);
    }
  }



  if (loading) return <div className='text-center mt-4'>Loading...</div>;
  if (error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>;

  return (
    <div className="p-4 h-full w-full">

      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Bookings</h1>

        {(step === 'start' || step === 'room') && <div className="flex items-center space-x-4">
          {/* Start Date Selector */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="p-2 rounded-md border bg-darkcard"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date Selector */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium ">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="p-2 rounded-md border bg-darkcard"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={() => { fetchBookingData() }}>Filter Bookings</button>
        </div>}

        <button
          className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer'
          onClick={() => {
            if (step === 'start') {
              setStep('customer')
              setShowForm(true);
            }
            else {
              setStep('start');
              setShowForm(false);
              setCustomer('');
              setEndDate('');
              setSelectedRooms([]);
              setEndDate(initialEndDate);
              setStartDate(initialStartDate);
            }
          }}
        >
          {step === 'start' && (showForm ? 'Cancel' : 'Add Booking')}
          {step === 'customer' && 'Exit Booking'}
          {step === 'room' && 'Exit Booking'}
          {step === 'bookingDetails' && 'Exit'}

        </button>
      </div>

      {step === 'start' && <div className=''>
        {bookings?.map((booking) => {

          return (
            <div className='border mb-2 bg-darkcard px-5 py-2 rounded-md' onClick={() => {
              console.log(booking);
              setCurrBooking(booking);
              setStep('BookingDetails');
            }}>
              <div className='flex gap-4'>
                <h1>
                  {booking?.Customer?.Name} ({booking?.Customer?.Age})
                </h1>
                Co-Travellers :
                {booking?.Customer?.CoPassengers.map((passenger) => {
                  return (
                    <h1>
                      {passenger.Name} ({passenger.Age})
                    </h1>
                  );
                })}
              </div>
              <div className='flex gap-4'>
                Rooms :
                {booking?.Rooms.map((room) => {
                  return (<h1>{room.roomNumber} ({room.type}),</h1>);
                })}
              </div>
              <div className='flex gap-5 justify-between'>
                <h1 className='text-green-400'>Check In - {formatDateToDDMMYYYY(booking.CheckIn)}</h1>
                <h1 className='text-red-400'>Check Out - {formatDateToDDMMYYYY(booking.CheckOut)}</h1>
              </div>
            </div>);
        })}
      </div>}

      {step === 'customer' &&
        <div >
          <CustomerSearchForm onSelectCustomer={(customer) => {
            setCustomer(customer);
            setStep('room');
            fetchRoomData();
            console.log(customer);
          }}>
          </CustomerSearchForm>
        </div>
      }

      {step === 'room' &&
        <div className='flex'>
          <div className='flex gap-4 flex-wrap max-w-2/3 w-full'>
            {rooms?.map((room) => {
              return (<RoomCard key={room._id} room={room} selectable={true} onSelect={(room) => {
                setSelectedRooms((prev) => [...prev, room])
                console.log(selectedRooms);
              }
              }
                onUnSelect={(room) => {
                  setSelectedRooms(selectedRooms.filter((selectedRoom) => selectedRoom._id != room._id));
                  console.log(selectedRooms);
                }}
                cb={() => { }}></RoomCard>);

            })}
          </div>
          <div className='bg-darkcard w-1/3 p-4 rounded-md'>
            <table class="table-auto border-collapse border border-gray-300 w-full">
              <caption class="font-semibold text-xl mb-4">Booking Summary</caption>
              <thead>
                <tr>
                  <th class="border-b px-4 py-2 text-left">Room No.</th>
                  <th class="border-b px-4 py-2 text-left">Type</th>
                  <th class="border-b px-4 py-2 text-left">Price</th>
                  <th class="border-b px-4 py-2 text-left">Booking Dates</th>
                </tr>
              </thead>
              <tbody>
                {selectedRooms.map((room, index) => {
                  const isFirstRow = index === 0;
                  return (
                    <tr key={room.roomNumber}>
                      <td class="border px-4 py-2">{room.roomNumber}</td>
                      <td class="border px-4 py-2">{room.type}</td>
                      <td class="border px-4 py-2">{room.price}</td>
                      {/* Use rowspan for booking dates */}
                      {isFirstRow && (
                        <td rowSpan={selectedRooms.length} class="border px-4 py-2">
                          {startDate} to {endDate}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" class="border px-4 py-2">Total Price: {priceCalculator()}</td>
                </tr>
              </tfoot>
            </table>

            <div className='flex items-center mt-4 gap-4'>
              <label htmlFor="payment-method" className="block mb-2 font-medium">
                Pay via :
              </label>
              <select
                id="payment-method"
                name="paymentMethod"
                value={paymentDetails.paymentMethod}
                onChange={(e) => setPaymentDetails((prev) => [...prev, [paymentMethod] = e.target.value])}
                className="p-2 border rounded-md bg-darkbg"
              >
                <option value="" disabled>
                  -- Select an option --
                </option>
                <option value="cash">Cash</option>
                <option value="online">Online Payment</option>
              </select>                </div>
            <button
              className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer mt-4'
              onClick={async (e) => {
                if (paymentDetails.paymentMethod === 'cash') {
                  await addBooking();
                } else {
                  await handlePayment(e);
                }
                setStep('BookingDetails');
              }}
            > Proceed

            </button>
          </div>
        </div>
      }

      {
        step === 'BookingDetails' && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-4">Booking Summary</h1>
            <table className="table-auto w-full border border-gray-300 mb-6">
              <thead>
                <tr className="bg-darkaccent">
                  <th className="text-left px-4 py-2 border">Booked By</th>
                  <th className="text-left px-4 py-2 border">Phone</th>
                  <th className="text-left px-4 py-2 border">Email</th>
                  <th className="text-left px-4 py-2 border">Address</th>
                  <th className="text-left px-4 py-2 border">Check In</th>
                  <th className="text-left px-4 py-2 border">Check Out</th>
                </tr>
              </thead>
              <tbody>
                <tr key={currBooking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{currBooking.Customer.Name}</td>
                  <td className="px-4 py-2 border">{currBooking.Customer.Phone}</td>
                  <td className="px-4 py-2 border">{currBooking?.Customer.Email}</td>
                  <td className="px-4 py-2 border">{currBooking?.Customer.Address}</td>
                  <td className="px-4 py-2 border">{formatDateToDDMMYYYY(currBooking?.CheckIn)}</td>
                  <td className="px-4 py-2 border">{formatDateToDDMMYYYY(currBooking?.CheckOut)}</td>
                </tr>
              </tbody>
            </table>

            {/* Co-Passengers Table */}
            <table className="table-auto w-full border border-gray-300 mb-8">
              <caption className="text-lg font-semibold mb-2">Co-Passenger Details</caption>

              <thead>
                <tr className="bg-darkaccent">
                  <th className="text-left px-4 py-2 border">Name</th>
                  <th className="text-left px-4 py-2 border">Age</th>
                </tr>
              </thead>
              <tbody>
                {currBooking.Customer.CoPassengers.map((passenger) => (
                  <tr key={passenger._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{passenger.Name}</td>
                    <td className="px-4 py-2 border">{passenger.Age}</td>
                  </tr>
                ))}
              </tbody>
            </table>


            {/* Rooms Table */}
            <table className="table-auto w-full border border-gray-300 mb-6">
              <caption className="text-lg font-semibold mb-2">Room Details</caption>

              <thead>
                <tr className="bg-darkaccent">
                  <th className="text-left px-4 py-2 border">Room Number</th>
                  <th className="text-left px-4 py-2 border">Price</th>
                  <th className="text-left px-4 py-2 border">Type</th>
                </tr>
              </thead>
              <tbody>
                {
                  currBooking.Rooms.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{room.roomNumber}</td>
                      <td className="px-4 py-2 border">₹{room.price}</td>
                      <td className="px-4 py-2 border">{room.type}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Rooms Table */}
            <table className="table-auto w-full border border-gray-300 mb-6">
              <caption className="text-lg font-semibold mb-2">Payment Details</caption>

              <thead>
                <tr className="bg-darkaccent">
                  <th className="text-left px-4 py-2 border">Payment Status</th>
                  <th className="text-left px-4 py-2 border">Mode</th>
                  <th className="text-left px-4 py-2 border">Transaction ID</th>
                  <th className="text-left px-4 py-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className={`px-4 py-2 border ${currBooking.PaymentDetails.status?"text-green-400":"text-red-400"}`}>{currBooking.PaymentDetails.status?"Paid":"Pending"}</td>
                  <td className="px-4 py-2 border">{currBooking.PaymentDetails.method}</td>
                  <td className="px-4 py-2 border text-center">{currBooking.PaymentDetails.transactionId || "---"}</td>                      <td className="px-4 py-2 border">    ₹            {currBooking.Amount}
                  </td>
                </tr>
              </tbody>
            </table>


            {/* Total Price */}
            <div className="mt-4 text-right">
              <h2 className="text-lg font-semibold">
                Total Price: ₹
              </h2>
            </div>
          </div>
        )}
    </div>
  );
};

export default Bookings;


