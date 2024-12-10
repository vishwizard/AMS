import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from '../components/RoomForm';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);  // Today's date
  const [endDate, setEndDate] = useState(() => {
    const start = new Date();
    start.setMonth(start.getMonth() + 1); // Add one month to the current date
    return start.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [update, setUpdate] = useState('');

  // const [showUpdateForm, setShowUpdateForm] = useState(false);

  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/?startDate=${startDate}&endDate=${endDate}`);
      // console.log(response.data);
      setRooms(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRoom = async (roomId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
      console.log('Room deleted:', response.data);
      setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error.response ? error.response.data : error.message);
    }
  };

  const updateRoom = async (roomData) => {
    try {
      const data = {
        "type": roomData.type,
        "price": roomData.price,
      }
      const response = await axios.put(`http://localhost:5000/api/rooms/${update._id}`, data);
      fetchData();
      // setUpdate('');
      return true;

    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const updateForm = (room) => {
    setShowForm(true);
    setUpdate(room);
    // console.log(update);
  }

  const addRoom = async (roomData) => {
    try {
      console.log(roomData);
      const response = await axios.post('http://localhost:5000/api/rooms', roomData);
      setRooms(prev => [...prev, response.data.room]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }



  if (loading) return <div className='text-center mt-4'>Loading...</div>;
  if (error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>;

  return (
    <div className="p-4 h-full w-full">

      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Rooms</h1>

        <div className="flex items-center space-x-4">
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
        </div>

        <button
          className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer'
          onClick={() => { setShowForm(!showForm) }}
        >
          {showForm ? 'Cancel' : 'Add Room'}
        </button>
      </div>


      {showForm && (
        <RoomForm
          key={update?.roomNumber || 'new'}
          onSubmitForm={update ? updateRoom : addRoom}
          Title={update?.roomNumber ? `Update Room ${update.roomNumber}` : 'Add New Room'}
          roomDetails={update}
        />
      )}

      <div className="flex flex-wrap gap-4 border border-darkaccent p-4 h-auto w-auto">
        {rooms.map((room) => (
          <div key={room._id} className={` max-h-48 border max-w-44 p-4 rounded shadow hover:shadow-lg transition ${!room.isBooked ? 'border-green-400' : 'border-red-600'}`}>
            <h2 className="text-xl font-semibold">{room.roomNumber}</h2>
            <p>Status: {!room.isBooked ? 'Available' : 'Booked'}</p>
            <p>{room.type}</p>
            <p>Price: {room.price}</p>
            <div className='flex mt-4 justify-between'>
              <button onClick={() => { updateForm(room) }} className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hover:scale-105 hover:bg-blue-600 size-6 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              {!room.isBooked && <button onClick={() => { deleteRoom(room._id) }} className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
