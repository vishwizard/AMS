
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Bookings from './pages/Bookings.jsx';
import Rooms from './pages/Rooms.jsx';
import Success from './pages/Success.jsx';
import Failure from './pages/Failure.jsx';

import Customers from './pages/Customers.jsx';
import './App.css'
import Layout from './components/Layout.jsx';
function App() {
    return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/rooms" element={<Rooms/>} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/failure" element={<Failure />} />

                </Routes>
            </Layout>
    )
}

export default App
