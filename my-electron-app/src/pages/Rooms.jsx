import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from '../components/RoomForm';
import RoomCard from '../components/RoomCard';

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

  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/?startDate=${startDate}&endDate=${endDate}`);
      setRooms(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCallback = (roomId)=>{
    setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
  }

  const updateRoom = async (roomData) => {
    try {
      const data = {
        "_id":roomData._id,
        "type": roomData.type,
        "price": roomData.price,
      }
      const response = await axios.put(`http://localhost:5000/api/rooms/${update._id}`, data);
      fetchData();
      return true;

    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const updateForm = (room) => {
    setShowForm(true);
    setUpdate(room);
  }

  const addRoom = async (roomData) => {
    try {
      console.log(roomData);
      const response = await axios.post('http://localhost:5000/api/rooms', roomData);
      console.log("This room was added : ", response);
      setRooms(prev => [...prev, {...response.data.data,isBooked:false}]);
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
          onClick={() => { setShowForm(!showForm); setUpdate('');}}
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
          <RoomCard room={room} updatable={true} deletable={true} /*deleteRoom={deleteRoom}*/ updateForm={updateForm} cb={deleteCallback}></RoomCard>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
