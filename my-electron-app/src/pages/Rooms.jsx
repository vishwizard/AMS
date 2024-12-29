import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import RoomForm from '../components/RoomForm';
import RoomCard from '../components/RoomCard';
import asyncHandler from '../../utils/asyncHandler';
import useSecureAxios from '../../utils/Axios.jsx';

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
  const [filteredRooms,setFilteredRooms] = useState([]);
  const [filter,setFilter] = useState('all');

  const secureAxios = useSecureAxios();

  const getRooms = asyncHandler(async () => {
    const response = await secureAxios.get(`/api/rooms/?startDate=${startDate}&endDate=${endDate}`);
    setRooms(response.data.data);
  }, setLoading, setError);

  const filterRooms = ()=>{
    setFilteredRooms(prev=>{
      if(filter==='all') return rooms;
      return rooms.filter((room)=>{
        return room.type===filter
      })
    })
  }

  useEffect(()=>{
    filterRooms();
  },[filter,rooms])


  useEffect(() => {
    getRooms();
    filterRooms();

  }, [startDate, endDate]);

  const deleteCallback = (roomId) => {
    setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
  };

  //too complex to deal with right now
  const updateRoom = async (roomData) => {
    try {
      setLoading(true);
      await secureAxios.put(`/api/rooms/${update._id}`, roomData);
      getRooms();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (room) => {
    setShowForm(true);
    setUpdate(room);
  };

  const addRoom = async (roomData) => {
    try {
      setLoading(true);
      const response = await secureAxios.post('/api/rooms', roomData);
      setRooms(prev => [...prev, { ...response.data.data, isBooked: false }]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex items-center space-x-4 my-2">
        <label className="light:text-gray-700 dark:text-white font-medium">Type:</label>
        <select className="border dark:bg-darkcard bg-lightcard border-gray-300 rounded-lg px-4 py-2 light:text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => {
          setFilter(e.target.value);
          }}>
          <option value="all">ALL</option>
          <option value="AC">AC</option>
          <option value="Non AC">Non AC</option>
        </select>
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
        {filteredRooms.map((room) => {
          return <RoomCard key={room._id} room={room} updatable={true} deletable={true} updateForm={updateForm} cb={deleteCallback}></RoomCard>;
        })}
      </div>
      }
    </div>
  );
};

export default Rooms;