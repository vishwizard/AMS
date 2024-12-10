import React, { useState } from 'react';
import axios from 'axios';
const CustomerForm = ({ onSubmitForm, Title, Details }) => {
    const [formData, setFormData] = useState({
        Name: Details.Name || '',
        Age: Details.Age || '',
        Gender: Details.Gender || '',
        Phone: Details.Phone || '',
        Email: Details.Email || '',
        Address: Details.Address || '',
        IDProof: Details.IDProof || '',
        IDProofNumber: Details.IDProofNumber || '',
        CoPassengers: Details.CoPassengers || [],
        Additional: Details.Additional || '',
        ImageURL: Details.ImageURL || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Handle field change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? (checked ? 'AC' : 'Non AC') : value,
        }));
    };
    const uploadImage = async () => {
        try {
            const formDataForImage = new FormData();
            formDataForImage.append('image', image);
    
            const response = await axios.post('http://localhost:5000/api/customers/upload', formDataForImage, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (response.status === 200) {
                return response.data.file.filename;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            return false;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            let filename = '';
    
            if (image) {
                filename = await uploadImage();
                if (!filename) {
                    setError('Failed to upload image.');
                    return; // Exit if image upload fails
                }
            }
    
            const updatedFormData = { ...formData, ImageURL: filename };
            setFormData(updatedFormData);
    
            const status = await onSubmitForm(updatedFormData);
            if (status === true) {
                setSuccess('Success!');
                resetForm();
                setImage(null);
                setPreview(null);
            } else {
                setError(status || 'Failed');
            }
        } catch (err) {
            console.error('Error during form submission:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    

    // Helper to reset form
    const resetForm = () => {
        setFormData({
            Name: '',
            Age: 0,
            Gender: 'M',
            Phone: '',
            Email: '',
            Address: '',
            IDProof: '',
            IDProofNumber: '',
            CoPassengers: [],
            Additional: '',
            ImageURL: '',
        });
        setPreview(null);
    };


    const handleCoPassengerChange = (e, index) => {
        const { name, value } = e.target;
        const newCoPassengers = [...formData.CoPassengers];
        newCoPassengers[index] = { ...newCoPassengers[index], [name]: value };
        setFormData((prevData) => ({
            ...prevData,
            CoPassengers: newCoPassengers
        }));
    };

    const addCoPassenger = () => {
        setFormData((prevData) => ({
            ...prevData,
            CoPassengers: [...prevData.CoPassengers, { name: '', age: '' }]
        }));
    };

    const removeCoPassenger = (index) => {
        const newCoPassengers = [...formData.CoPassengers];
        newCoPassengers.splice(index, 1);
        setFormData((prevData) => ({
            ...prevData,
            CoPassengers: newCoPassengers
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }

    };



    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">{Title}</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 text-white">
                <div>
                    <label className="block font-medium">Customer Name</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        maxLength={50}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">Age</label>
                    <input
                        type="number"
                        name="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                    />
                </div>
                <div className='flex gap-3'>
                    <label className="block font-medium">Gender</label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="Gender"
                                value="M"
                                checked={formData.Gender === 'M'}
                                onChange={handleChange}
                                required
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="Gender"
                                value="F"
                                checked={formData.Gender === 'F'}
                                onChange={handleChange}
                                required
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="Gender"
                                value="O"
                                checked={formData.Gender === 'O'}
                                onChange={handleChange}
                                required
                            />
                            Other
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        type="tel"
                        name="Phone"
                        value={formData.Phone}
                        onChange={(e) => {
                            const phone = e.target.value;
                            if (/^\d{0,10}$/.test(phone)) {
                                handleChange(e); // Update state only if validation passes
                            }
                        }}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                        placeholder="Enter 10-digit phone number"
                    />
                    {formData.Phone && formData.Phone.length !== 10 && (
                        <p className="text-red-500 text-sm">Phone number must be 10 digits</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                        placeholder="Enter a valid email address"
                    />
                    {formData.Email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.Email) && (
                        <p className="text-red-500 text-sm">Invalid email address</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium">Address</label>
                    <input
                        type='textarea'
                        name="Address"
                        value={formData.Address}
                        maxLength={100}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">ID Proof</label>
                    <select
                        name="IDProof"
                        value={formData.IDProof}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                    >
                        <option value="" disabled>Select ID Proof</option>
                        <option value="Aadhar">Aadhar</option>
                        <option value="PAN">PAN</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">ID Proof Number</label>
                    <input
                        type="text"
                        name="IDProofNumber"
                        value={formData.IDProofNumber}
                        maxLength={50}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                        required
                    />
                </div>

                <div className='relative'>
                    <img
                        src={formData.ImageURL === '' ? (preview ? preview : './images/Upload.jpg') : `./images/${formData?.ImageURL}`} // Image or default avatar
                        alt="Customer Image"
                        className="w-28 h-28 rounded-md mb-4 "
                        onClick={() => { document.getElementById('ImageUpload').click(); }}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setPreview(null);
                            setFormData(prev => ({
                                ...prev,
                                ImageURL: ''
                            }))
                        }}
                        className="bg-red-500 bottom-1 left-20 text-white p-1 rounded-md hover:bg-red-600 absolute"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                    </button>
                </div>
                <div>
                    <label className="block font-medium">Upload Image</label>
                    <input
                        type="file"
                        id='ImageUpload'
                        name="ImageURL"
                        onChange={(e) => { handleImageChange(e); }}
                        className="w-full p-2 border rounded bg-darkcard"
                        accept="image/*"
                    />
                </div>

                <div>
                    <label className="block font-medium">Co-passenger(s)</label>
                    {formData?.CoPassengers?.map((coPassenger, index) => (
                        <div key={index} className="flex space-x-4 mb-4">
                            <input
                                type="text"
                                name={`Name`}
                                value={coPassenger.Name}
                                onChange={(e) => handleCoPassengerChange(e, index)}
                                placeholder="Co-passenger Name"
                                className="p-2 border rounded w-full bg-darkcard"
                                required
                            />
                            <input
                                type="number"
                                name={`Age`}
                                value={coPassenger.Age}
                                onChange={(e) => handleCoPassengerChange(e, index)}
                                placeholder="Age"
                                className="p-2 border rounded w-full bg-darkcard"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeCoPassenger(index)}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addCoPassenger}
                        className="bg-blue-500 text-white p-2 rounded mt-2"
                    >
                        Add Co-passenger
                    </button>
                </div>
                <div>
                    <label className="block font-medium">Additional Remarks</label>
                    <input
                        type='textarea'
                        name="Additional"
                        value={formData.Additional}
                        maxLength={200}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-darkcard"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-darkaccent cursor-pointer text-white rounded"
                    disabled={loading}
                >
                    {loading ? (Title === 'Add New Customer' ? 'Adding Customer...' : 'Updating Customer...') : (Title === 'Add New Customer' ? 'Add Customer' : 'Update Customer')}
                </button>
            </form>
        </div>
    );
};

export default CustomerForm;
