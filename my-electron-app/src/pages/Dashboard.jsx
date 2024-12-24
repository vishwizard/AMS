// src/Dashboard.jsx
import React from 'react';
import Tabs from '../components/Tabs';
const Dashboard = () => {
  return (
    <div className=''>
    <div className='mt-5 px-12 flex items-center justify-between'>
      <div className='flex items-center'>
      <img src='/Ganesha.png' className='size-24'></img>
      <h1 className='text-2xl'>Jai Ganesh! Mr. Vasu</h1>
      </div>
      
      <div className='size-24'>
      <img src='/satram.jpg' className='rounded-full'></img>
      </div>
    </div>
    <div className='border border-t-2 mt-5 border-darkaccent'>
      <Tabs></Tabs>
    </div>
    </div>
  );
};

export default Dashboard;
