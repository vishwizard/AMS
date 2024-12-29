import React, { useState, useEffect } from 'react';
import CustomerForm from '../components/CustomerForm';
import CustomerCard from '../components/CustomerCard';
import asyncHandler from '../../utils/asyncHandler';
import useSecureAxios from '../../utils/Axios';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [update, setUpdate] = useState('');
  // const [key, setKey] = useState(0);

  const secureAxios = useSecureAxios();

  const getCustomers = asyncHandler(async () => {
    const response = await secureAxios.get('/api/customers');
    setCustomers(response.data.data);
  }, setLoading, setError)

  const deletecb = (customerId) => {
    setCustomers(prev => prev.filter(customer => customer._id !== customerId));
  };

  const updateForm = (customer) => {
    console.log("Received Data : ", customer);
    setShowForm(true);
    setUpdate(prev=>customer);
    // setKey(prev => prev + 1);
  }

  useEffect(() => {
    getCustomers();
  }, []);

  // if (loading) return <div className='text-center mt-4'>Loading...</div>;
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

      <div>

      </div>


      {showForm && (
        <CustomerForm
          // key={key}
          Details={update}
          getCustomers={()=>{getCustomers();}}
        />
      )}

      <div className="flex flex-wrap gap-4 border border-darkaccent p-4 w-full">
        {error && <div className='text-red-500 text-center mt-4'>Error: {error}</div>}

        {loading && <div className='text-center mt-4'>Loading...</div>}

        {!error && !loading && customers.map((customer) => (
          <CustomerCard
            key={customer._id}
            customer={customer}
            actions={{
              onUpdate: updateForm,
              cb: deletecb,
              updatable: true,
              deletable: true,
            }}
          />

        ))}
      </div>

    </div>
  );
};

export default Customer;
