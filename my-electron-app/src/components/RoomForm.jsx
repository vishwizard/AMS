import React, { useState } from 'react';
import axios from 'axios';

const RoomForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'NON-AC',  // Default type
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? (checked ? 'AC' : 'NON-AC') : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('https://ams-a9n2.onrender.com/api/rooms', formData);
      setSuccess('Room added successfully!');
      setFormData({ name: '', type: 'NON-AC', price: 0 }); 
    } catch (err) {
      setError('Failed to add room.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Room</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div>
          <label className="block font-medium">Room Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-darkcard"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-darkcard"
            required
          />
        </div>
        <div className='flex gap-4 items-center'>
          <label className="block font-medium">Room Type</label>
          <div className="flex items-center">
            <button
              type="button"
              className={`px-4 py-2 rounded ${formData.type === 'AC' ? 'bg-blue-500' : 'bg-gray-700'}`}
              onClick={() =>
                setFormData((prevState) => ({
                  ...prevState,
                  type: prevState.type === 'AC' ? 'NON-AC' : 'AC',
                }))
              }
            >
              {formData.type === 'AC' ? 'AC' : 'NON-AC'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-darkaccent cursor-pointer text-white rounded"
          disabled={loading}
        >
          {loading ? 'Adding Room...' : 'Add Room'}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
