import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerForm from '../components/CustomerForm';
//fix1

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [update, setUpdate] = useState('');
  const [key, setKey] = useState(0);
  // const [showUpdateForm, setShowUpdateForm] = useState(false);

  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/`);
      // console.log(response.data);
      setCustomers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/customers/${customerId}`);
      // console.log('Customer deleted:', response.data);
      setCustomers(prev => prev.filter(customer => customer._id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error.response ? error.response.data : error.message);
    }
  };

  const updateCustomer = async (customerData) => {
    try {
      const data = customerData;
      const response = await axios.put(`http://localhost:5000/api/customers/${update._id}`, data);
      fetchData();
      return true;

    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const updateForm = (customer) => {
    setShowForm(true);
    setUpdate(customer);
    setKey(prev => prev + 1);
    // console.log(update);
  }

  const addCustomer = async (customerData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/customers', customerData);
      // console.log(response);

      setCustomers(prev => [...prev, response.data]);
      return true;
    } catch (err) {
      console.error(err);
      if (err?.code === 0) {
        setError('User already exists with the same Phone Number, Email or ID Proof');
      }
      return 'User already exists with the same Phone Number, Email or ID Proof';
    }
  }



  if (loading) return <div className='text-center mt-4'>Loading...</div>;
  if (error) return <div className='text-red-500 text-center mt-4'>Error: {error}</div>;

  return (
    <div className="p-4 h-full w-full">

      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Customers</h1>

        <button
          className='bg-darkaccent p-2 rounded-md text-xl shadow-md cursor-pointer'
          onClick={() => {
            setUpdate('');
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>


      {showForm && (
        <CustomerForm
          // key={update?.Phone || 'new'}
          key={key}
          onSubmitForm={update ? updateCustomer : addCustomer}
          Title={update?.Name ? `Updating Details of ${update.Name}` : 'Add New Customer'}
          Details={update}
        />
      )}

      <div className="flex flex-wrap gap-4 border border-darkaccent p-4 w-full">
        {customers.map((customer) => (
          <div key={customer?._id} className="max-w-64 w-full p-4 rounded-lg shadow-lg bg-darkcard text-white border-2 border-gray-200 hover:shadow-xl transition">
            <div className="flex flex-col items-start">
              <img
                src={(customer?.ImageURL===''?'./images/Avatar.png':`./images/${customer?.ImageURL}`)} // Image or default avatar
                alt="Customer Image"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">
                {customer?.Name.length > 15
                  ? `${customer?.Name.split(' ')[0]} ${customer?.Name.split(' ')[1]?.[0]}.`
                  : customer?.Name}
                ({customer?.Age}, {customer?.Gender})
              </h2>
              <p className="text-sm ">Contact: {customer?.Phone}, <br />{customer?.Email}</p>
              <p className="text-sm ">Address: {customer?.Address}</p>
              <p className="text-sm ">{customer?.IDProof}: {customer?.IDProofNumber}</p>
              <div className="mt-4 w-full flex justify-between">
                <button
                  onClick={() => updateForm(customer)}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>

                </button>
                <button
                  onClick={() => deleteCustomer(customer?._id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>

                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Customer;
