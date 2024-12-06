
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Bookings from './pages/Bookings.jsx';
import Rooms from './pages/Rooms.jsx';
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
                </Routes>
            </Layout>
    )
}

export default App
