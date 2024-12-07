import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomForm from '../components/RoomForm';


const deleteRoom = async (roomId) => {
  try {
    const response = await axios.delete('https://ams-a9n2.onrender.com/api/rooms');
    console.log('Room deleted:', response.data);
  } catch (error) {
    console.error('Error deleting room:', error.response ? error.response.data : error.message);
  }
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://ams-a9n2.onrender.com/api/rooms');
        // console.log(response.data);
        setRooms(response.data); 
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    }, []);



  if (loading) return <div className='text-center mt-4'>Loading...</div>;
  if (error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Rooms</h1>
        <button className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer' onClick={()=>{setShowForm(!showForm)}}>
          {showForm?'Cancel':'Add Room'}
        </button>
      </div>

      {showForm && <RoomForm></RoomForm>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className={`border p-4 rounded shadow hover:shadow-lg transition ${room.available ? 'border-green-400' : 'border-red-600'}`}>
            <h2 className="text-xl font-semibold">{room.roomNumber}</h2>
            <p>Status: {room.available ? 'Available' : 'Booked'}</p>
            <p>{room.type}</p>
            <p>Price: {room.price}</p>
            <div className='flex mt-4 justify-between'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hover:scale-105 hover:bg-blue-600 size-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              <button onClick={()=>{deleteRoom(room._id)}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hover:scale-105 hover:bg-red-600 size-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
