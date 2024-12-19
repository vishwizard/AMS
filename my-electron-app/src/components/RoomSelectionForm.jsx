import React, { useState } from 'react';

const RoomSelectionForm = ({ onRoomSelection }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [rooms, setRooms] = useState([]);

  const handleRoomSelect = (roomId) => {
    setRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const handleSubmit = () => {
    if (!checkInDate || !checkOutDate || rooms.length === 0) {
      alert('Please select all required fields.');
      return;
    }
    onRoomSelection(rooms, checkInDate, checkOutDate);
  };

  return (
    <div className="room-selection-form">
      <input
        type="date"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
      />
      <input
        type="date"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
      />
      <div className="rooms">
        {/* Example Room List */}
        {[1, 2, 3].map((roomId) => (
          <div key={roomId}>
            <input
              type="checkbox"
              id={`room-${roomId}`}
              checked={rooms.includes(roomId)}
              onChange={() => handleRoomSelect(roomId)}
            />
            <label htmlFor={`room-${roomId}`}>Room {roomId}</label>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Confirm Rooms</button>
    </div>
  );
};

export default RoomSelectionForm;
