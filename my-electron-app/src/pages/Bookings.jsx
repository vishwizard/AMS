// import React, { useState } from 'react';
import CustomerSearchForm from '../components/CustomerSearchForm';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';
import Invoice from '../components/Invoice';
import dateFormatter from '../../utils/DateFormatter'
import { fetchBookings, fetchRooms, priceCalculator, deleteBooking, getInvoicePDF } from '../../utils/functions';

const Bookings = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [customer, setCustomer] = useState('');
  const [bookings, setBookings] = useState([]);
  const [currBooking, setCurrBooking] = useState([]);
  const [step, setStep] = useState('start');
  const [paymentDetails, setPaymentDetails] = useState({
    method: 'Cash',
    transactionId: '',
    status: false
  });

  const printRef = useRef();

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

  const getRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await fetchRooms(startDate, endDate);
      setRooms(roomsData);
    } catch (error) {
      setError("Error getting room data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const getBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await fetchBookings(startDate, endDate);
      setBookings(prev => bookingsData);
    } catch (err) {
      console.log(err);
      setError("Error getting bookings data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBookings();
  }, []);

  const data = {
    name: customer.Name,
    amount: priceCalculator(selectedRooms, startDate, endDate),
    number: customer.Phone,
    MUID: "MUID" + Date.now(),
    transactionId: 'T' + Date.now(),
  }

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await deleteBooking(bookingId);
      if (response) {
        setBookings(prev => prev.filter(bkg => bkg._id !== bookingId));
        console.log("Booking deleted successfully");
      }
    } catch (err) {
      setError("Unable to cancel booking");
      console.error("Error deleting booking:", err);
    }finally{
      setLoading(false);
    }
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

  const addBooking = async () => {
    try {
      const selectedRoomIds = selectedRooms.map((room) => room._id);
      if (paymentDetails.method === 'Cash') {
        setPaymentDetails(prev => ({ ...prev, status: true }));
      }
      const data = {
        Customer: customer._id,
        Rooms: selectedRoomIds,
        CheckIn: new Date(startDate),
        CheckOut: new Date(endDate),
        PaymentDetails: paymentDetails,
        Amount: priceCalculator(selectedRooms, startDate, endDate)
      };
      const response = await axios.post('http://localhost:5000/api/bookings', data);
      setCurrBooking(response.data.data);
      getBookings();
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) return <div className='text-center mt-4'>Loading...</div>;
  if (error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>;

  return (
    <div className="p-4 h-auto w-full">

      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Bookings</h1>

        {(step === 'start' || step === 'room') && <div className="flex items-center space-x-4 ">
          {/* Start Date Selector */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="p-2 rounded-md border bg-lightcard dark:bg-darkcard"
              value={startDate}
              onChange={(e) => {
                const newStartDate = e.target.value;
                if (new Date(newStartDate) <= new Date(endDate)) {
                  setStartDate(newStartDate);
                } else {
                  alert("Start date must be before the end date.");
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="p-2 rounded-md border bg-lightcard dark:bg-darkcard"
              value={endDate}
              onChange={(e) => {
                const newEndDate = e.target.value;
                if (new Date(newEndDate) >= new Date(startDate)) {
                  setEndDate(newEndDate);
                } else {
                  alert("End date must be after the start date.");
                }
              }}
            />
          </div>
          <button className={'bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer'
          } onClick={() => {
            if (step === 'start') {
              getBookings();
            } else {
              getRooms();
            }
          }}>Filter</button>

        </div>}


        <div className='flex gap-4'>
          {step === 'BookingDetails' && <button
            className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer'
            onClick={async () => {
              await getInvoicePDF(printRef,currBooking.invoiceNumber);
            }}
          >
            Download Invoice
          </button>}
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
            {step === 'BookingDetails' && 'Exit'}

          </button>
        </div>
      </div>

      {step === 'start' && <div className=''>
        {bookings?.map((booking) => {

          return (
            <div className='border mb-2 bg-lightcard dark:bg-darkcard px-5 py-2 rounded-md' >
              <div className='flex gap-4 justify-between'>
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
                  <button onClick={() => {
                    console.log(booking);
                    setCurrBooking(booking);
                    setStep('BookingDetails');
                  }} className='bg-darkaccent text-white p-2 rounded-md  hover:opacity-80'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { }}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { cancelBooking(booking._id) }}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>

                </div>

              </div>
              <div className='flex gap-4'>
                Rooms :
                {booking?.Rooms.map((room) => {
                  return (<h1>{room.roomNumber} ({room.type}),</h1>);
                })}
              </div>
              <div className='flex gap-5 justify-between'>
                <h1 className='text-green-400'>Check In - {dateFormatter(booking.CheckIn)}</h1>
                <h1 className='text-red-400'>Check Out - {dateFormatter(booking.CheckOut)}</h1>
              </div>
            </div>);
        })}
      </div>}

      {step === 'customer' &&
        <div >
          <CustomerSearchForm onSelectCustomer={(customer) => {
            setCustomer(customer);
            setStep('room');
            getRooms();
            console.log(customer);
          }}>
          </CustomerSearchForm>
        </div>
      }

      {step === 'room' &&
        <div className='flex'>
          <div className='flex gap-4 flex-wrap max-w-2/3 w-full'>

            {
              error ? <div className='text-red-500 text-center mt-4'>Error: {error}</div> :

                rooms?.map((room) => {
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
          <div className='bg-lightcard dark:bg-darkcard w-1/3 p-4 rounded-md'>
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
                  <td colSpan="3" class="border px-4 py-2">Total Price: {priceCalculator(selectedRooms, startDate, endDate)}</td>
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
                value={paymentDetails.method}
                onChange={(e) => setPaymentDetails((prev) => [...prev, [method] = e.target.value])}
                className="p-2 border rounded-md bg-bglight dark:bg-darkbg"
              >
                <option value="" disabled>
                  -- Select an option --
                </option>
                <option value="Cash">Cash</option>
                <option value="Online">Online Payment</option>
              </select>                </div>
            <button
              className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer mt-4'
              onClick={async (e) => {
                if (paymentDetails.method === 'Cash') {
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
        step === 'BookingDetails' &&
        <Invoice data={currBooking} ref={printRef}>

        </Invoice>
      }
    </div>
  );
};

export default Bookings;


