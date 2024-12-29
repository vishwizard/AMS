
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Bookings from './pages/Bookings.jsx';
import Rooms from './pages/Rooms.jsx';
import Customers from './pages/Customers.jsx';
import './App.css'
import Layout from './components/Layout.jsx';
import { useDispatch } from 'react-redux';

import LoginForm from './components/LoginForm.jsx';
import { useEffect, useState } from 'react';
import { login } from './store/AuthSlice.js';
// import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import useSecureAxios from '../utils/Axios.jsx';

function App() {
    const [redirect,setRedirect] = useState(false);
    const secureAxios = useSecureAxios();
    const dispatch = useDispatch();
    const getUserFromToken = async(token)=>{
        try {
            const response = await secureAxios.get("http://localhost:5000/api/user/refreshToken");
            console.log("GetUserProfile : ", response);
            const data = {
                username:response.data.data.username,
                role:response.data.data.role,
                token:response.data.data.token,
                isAuthenticated:true,
            }
            dispatch(login(data));
        } catch (error) {
            console.log(error);
            setRedirect(true);
            localStorage.removeItem('token');
        }
    }
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            getUserFromToken(token);
        }
    },[])

  
    return (
            <Layout>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                    <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                    {/* <Route path="/success" element={<Success />} />
                    <Route path="/failure" element={<Failure />} /> */}
                    <Route path="/login" element={<LoginForm/>}/>
                </Routes>
            </Layout>
    )
}

export default App
