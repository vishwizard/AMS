import axios from 'axios';
import React, { useState } from 'react';

export default function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [status,setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('');

  const handleUserRegistration = async()=>{
    console.log("This")

    try {
        setLoading(true);
        if(!username || !password || !role){
            alert("Please fill all required feilds");
        }
        const response = await axios.post("http://localhost:5000/api/user/register",{username,password,role});
        console.log(response);
        if(response){
            setStatus("User Added Successfully");
        }
    } catch (error) {
        console.log(error);
    }finally{
        setLoading(false);
    }
  }


  return (
    <div className="flex justify-center pt-10">
      <div className="bg-white dark:bg-darkcard p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Register</h2>
        <form onSubmit={(e)=>{
            e.preventDefault();
            handleUserRegistration();
            }}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter your username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-gray-700 dark:text-gray-300">
                Show Password
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              name="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {status && <p className='text-green-400'>{status}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}