import React, { useEffect, useState } from 'react';
import CustomerForm from './CustomerForm';
import axios from 'axios';
import CustomerCard from './CustomerCard';

const CustomerSearchForm = ({ onSelectCustomer }) => {
  const [searchData, setSearchData] = useState({
    Phone: '',
    Email: '',
    IDProof: '',
    IDProofNumber: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [customers, setCustomers] = useState([]);

  const fetchRecentCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/customers/recent', {
        params: { limit: 5 },
      });
      console.log(data);
      setCustomers(data.data);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer=(customer)=>{
    onSelectCustomer(customer);
  }

  useEffect(() => {
    fetchRecentCustomers();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/customers/search', {
        params: searchData,
      });
      setCustomers(data.data);
      setStatus(200);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.status || 500);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const addCustomer = async (customerData) => {
    try {
      await axios.post('http://localhost:5000/api/customers', customerData);
      setShowForm(false);
      fetchRecentCustomers();
      return true;
    } catch (err) {
      console.error(err);
      return "Error Adding Yatri";
    }
  };

  return (
    <div className="customer-search-form">
      {!showForm ? (
        <form onSubmit={handleSearch}>
          <div className="flex gap-10 w-full">
            {['Phone', 'Email'].map((field) => (
              <div className="w-96" key={field}>
                <label className="block font-medium">Search by {field}</label>
                <input
                  type={field === 'Email' ? 'email' : 'text'}
                  name={field}
                  value={searchData[field]}
                  maxLength={200}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-darkcard"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4 mb-10 mt-5 items-end">
            <div>
              <label className="block font-medium">ID Proof</label>
              <select
                name="IDProof"
                value={searchData.IDProof}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-darkcard"
              >
                <option value="" disabled>Select ID Proof</option>
                {['Aadhar', 'PAN', 'Voter ID', 'Other'].map((proof) => (
                  <option value={proof} key={proof}>{proof}</option>
                ))}
              </select>
            </div>
            <div className="w-96">
              <label className="block font-medium">ID Proof Number</label>
              <input
                type="text"
                name="IDProofNumber"
                value={searchData.IDProofNumber}
                maxLength={50}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-darkcard"
              />
            </div>
          </div>
          <div className="gap-4 flex">
            <button
              type="submit"
              className="w-64 h-11 border border-darkaccent cursor-pointer text-darkaccent rounded"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              className="w-64 h-11 bg-darkaccent cursor-pointer text-white rounded"
              disabled={loading}
              onClick={() => setShowForm(true)}
            >
              Add New Yatri
            </button>
          </div>
        </form>
      ) : (
        <CustomerForm onSubmitForm={addCustomer} Title="Add New Yatri" Details="" />
      )}
      <div className='mt-4 border p-4 rounded-md'>
        <h1 className='text-xl mb-4'>Select Yatri</h1>
        <div className="flex gap-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              actions={{
                selectable: true,
                onSelect: updateCustomer,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSearchForm;
