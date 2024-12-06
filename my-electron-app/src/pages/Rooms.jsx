// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect( ()=>{
    async function fetchData(){
      const data = await fetch('https://ams-a9n2.onrender.com/api/rooms');
      return data;
    }
    try{
      const response = fetchData();
      if(!response.ok) throw new Error('Failed to fetch rooms');
      setRooms(response);
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  },[]);

  if(loading) return <div className='text-center mt-4'>Loading...</div>;
  if(error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p>Status: {room.isBooked ? 'Booked' : 'Available'}</p>
            <p>Capacity: {room.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
