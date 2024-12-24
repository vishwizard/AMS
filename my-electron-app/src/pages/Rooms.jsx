import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from '../components/RoomForm';
import RoomCard from '../components/RoomCard';
import { fetchRooms } from '../../utils/functions';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const start = new Date();
    start.setMonth(start.getMonth() + 1);
    return start.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [update, setUpdate] = useState('');

  const getRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await fetchRooms(startDate,endDate);
      setRooms(roomsData);
    } catch (err) {
      console.log(err);
      setError("Error getting room data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, [startDate, endDate]);

  const deleteCallback = (roomId) => {
    setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
  };

  const updateRoom = async (roomData) => {
    try {
      const data = {
        "_id": roomData._id,
        "type": roomData.type,
        "price": roomData.price,
      };
      await axios.put(`http://localhost:5000/api/rooms/${update._id}`, data);
      getRooms();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const updateForm = (room) => {
    setShowForm(true);
    setUpdate(room);
  };

  const addRoom = async (roomData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/rooms', roomData);
      setRooms(prev => [...prev, { ...response.data.data, isBooked: false }]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // if (loading) return <div className='text-center mt-4'>Loading...</div>;
  if (error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>;

  return (
    <div className="p-4 h-full w-full">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Rooms</h1>

        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="p-2 rounded-md border bg-lightcard dark:bg-darkcard"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer'
          onClick={() => { setShowForm(!showForm); setUpdate(''); }}
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

      {loading ? <div className='text-center mt-4'>Loading...</div> : <div className="flex flex-wrap gap-4 border border-darkaccent p-4 h-auto w-auto">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} updatable={true} deletable={true} updateForm={updateForm} cb={deleteCallback}></RoomCard>
        ))}
      </div>
      }
    </div>
  );
};

export default Rooms;