import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/AuthSlice';
import axios from 'axios';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const [status,setStatus] = useState('');

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/user/login', { username, password });
            // console.log(response);
            const data = {username:response.data.data.username,role:response.data.data.role,token:response.data.data.token};
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            setStatus("Logged In Successfully");
            setUsername('');
            setPassword('');
            setShowPassword(false);
        } catch (error) {
            setError(error);
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center pt-10">
            <div className="bg-bglight dark:bg-darkcard p-8 text-xl rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 dark:text-white font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={username}
                            name="email"
                            className="dark:text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 dark:text-white font-medium mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            name="password"
                            className="dark:text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="mr-2"
                        />
                        <label htmlFor="showPassword" className="text-gray-700 dark:text-white">
                            Show Password
                        </label>
                    </div>
                    {status && <p className='text-green-400 mb-2'>{status}</p>}
                    {error && <p className='text-red-400 mb-2'>{error}</p>}
                    {loading && <p className=' mb-2'>Loading...</p>}

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        onClick={(e) => { handleLogin(e) }}
                    >
                        {loading?"Loading...":"Login"}
                    </button>
                </form>
                
            </div>

            {/* <RegistrationForm></RegistrationForm> */}
        </div>
    );
}