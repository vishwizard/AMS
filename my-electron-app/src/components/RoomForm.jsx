import React, { useState } from 'react';

const RoomForm = ({onSubmitForm,Title,roomDetails}) => {
  const [formData, setFormData] = useState({
    roomNumber: roomDetails.roomNumber || '',
    type: roomDetails.type || 'Non AC',  // Default type
    price: roomDetails.price || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? (checked ? 'AC' : 'Non AC') : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const status = await onSubmitForm(formData);
    if(status){
      setSuccess('Success!');
      setFormData({ roomNumber: '', type: 'Non AC', price: 0 });
    }else{
      setError('Failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{Title}</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div>
          <label className="block font-medium">Room Name</label>
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
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
                  type: prevState.type === 'AC' ? 'Non AC' : 'AC',
                }))
              }
            >
              {formData.type === 'AC' ? 'AC' : 'Non AC'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-darkaccent cursor-pointer text-white rounded"
          disabled={loading}
        >
          {loading ? (Title==='Add New Room'?'Adding Room...':'Updating Room...' ): (Title==='Add New Room'?'Add Room':'Update Room' )}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
