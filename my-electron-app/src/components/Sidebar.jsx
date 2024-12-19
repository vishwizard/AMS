// import { ipcRenderer } from "electron";
import React from "react";
import { Link, useLocation } from 'react-router-dom';
const Sidebar = ()=>{
    const location = useLocation();

    const isActive = (path) => location.pathname === path;
    const ActiveClass = ' text-xl rounded-lg outline outline-1 outline-hoverColor text-hoverColor my-1 flex justify-center';
    const linkClass=' text-xl transform transition-transform duration-100 ease in out hover:scale-105 rounded-lg hover:bg-hoverColor bg-darkaccent cursor-pointer my-1 flex justify-center';
    return (<>
    <div className="sidebar p-2 pt-20 bg-darkcard min-h-full rounded-md">
            <ul className="">
                <li className={isActive('/')?ActiveClass:linkClass}><Link to="/" className="w-full h-full py-2 text-center">Dashboard</Link></li>
                <li className={isActive('/bookings')?ActiveClass:linkClass}><Link to="/bookings" className="w-full py-2 text-center h-full">Bookings</Link></li>
                <li className={isActive('/rooms')?ActiveClass:linkClass}><Link to="/rooms" className="w-full py-2 text-center h-full">Rooms</Link></li>
                <li className={isActive('/customers')?ActiveClass:linkClass}><Link to="/customers" className="w-full py-2 h-full text-center">Customers</Link></li>
                <li className={linkClass}><button className="w-full h-full py-2 text-center" id='exitbtn' onClick={()=>{
                    // ipcRenderer.send('app-exit');
                }}>Exit</button></li>
            </ul>
        </div>
    </>)
}

export default Sidebar;