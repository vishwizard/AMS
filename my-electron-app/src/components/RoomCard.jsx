import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const RoomCard = ({ room, updatable = false, deletable = false, selectable = false, onSelect = () => { }, onUnSelect = () => { }, updateForm = () => { }, cb }) => {
  const [selected, setSelected] = useState(false);

  const user = useSelector(state=>state.auth);

  const deleteRoom = async (roomId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
      cb(roomId);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  console.log(deletable);


  return (
<div className={`max-h-48 border bg-lightcard dark:bg-darkcard max-w-44 p-4 rounded shadow hover:shadow-lg transition ${selected ? 'border-darkaccent text-gray-400' : (!room?.isBooked ? 'border-green-400' : 'border-red-600')}`}>
<h2 className="text-xl font-semibold">{room.roomNumber ?? "Unknown Room"}</h2>
      <p>Status: {!room.isBooked ? 'Available' : 'Booked'}</p>
      <p>Type: {room.type ?? "N/A"}</p>
      <p>Price: {room.price ?? "N/A"}</p>
      <div className="flex mt-4 justify-between items-center gap-2">
        {user.role==='admin' &&  updatable && (
          <button
            onClick={() => updateForm(room)}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
        )}
        {user.role==='admin' && deletable && (
          !room.isBooked?
          <button
            onClick={() => deleteRoom(room._id)}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>:<p>Room filled</p>
        )}
        {selectable && !room.isBooked && (
          <button
            onClick={() => {
              if (selected) {
                onUnSelect(room);
              } else {
                onSelect(room);
              }
              setSelected(!selected);
            }}
            className={` ${selected ? 'bg-red-600 hover:bg-red-600' : 'bg-darkaccent hover:bg-darkaccent'} text-white p-2 rounded-md  hover:opacity-80`}
          >
            {selected ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            }

          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
