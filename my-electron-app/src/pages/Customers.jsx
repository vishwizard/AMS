import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerForm from '../components/CustomerForm';
import CustomerCard from '../components/CustomerCard';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [update, setUpdate] = useState('');
  const [key, setKey] = useState(0);

  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/`);
      setCustomers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deletecb = (customerId) => {
      setCustomers(prev => prev.filter(customer => customer._id !== customerId));
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
  }

  const addCustomer = async (customerData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/customers', customerData);

      setCustomers(prev => [...prev, response.data.data]);
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
          key={key}
          onSubmitForm={update ? updateCustomer : addCustomer}
          Title={update?.Name ? `Updating Details of ${update.Name}` : 'Add New Yatri'}
          Details={update}
        />
      )}

      <div className="flex flex-wrap gap-4 border border-darkaccent p-4 w-full">
        {customers.map((customer) => (
          <CustomerCard
          key={customer._id}
          customer={customer}
          actions={{
            onUpdate: updateForm,
            cb:deletecb,
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
