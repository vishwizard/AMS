// import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import { logout } from "../store/AuthSlice";
import ThemeToggle from "./ThemeToggle";
const Sidebar = () => {
    const location = useLocation();
    const [dark, setDark] = useState(false);

    const user = useSelector(state => state.auth);
    // console.log("User : ", user);

    const dispatch = useDispatch();

    useEffect(() => {
        const root = document.getElementById("root").setAttribute("class", dark ? "dark" : "light");
    }, [dark]);

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        dispatch(logout());
    }

    const isActive = (path) => location.pathname === path;
    const ActiveClass = ' text-xl rounded-lg outline outline-1 outline-hoverColor text-hoverColor my-1 flex justify-start bg-lightcard dark:bg-darkcard  py-2 pl-4';
    const linkClass = ' text-xl transform transition-transform duration-100 ease in out hover:scale-105 rounded-lg hover:bg-hoverColor bg-darkaccent cursor-pointer my-1 flex justify-start text-white  py-2 pl-4';
    return (<>
        <div className="sidebar p-2 pt-20 bg-lightcard dark:bg-darkcard min-h-full rounded-md flex flex-col justify-between">
            <ul className="">


                {user.isAuthenticated && <li ><Link to="/" className={isActive('/') ? ActiveClass : linkClass}>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                        </svg>
                        Dashboard
                    </div>
                </Link></li>}


                {user.isAuthenticated && <li ><Link to="/bookings" className={isActive('/bookings') ? ActiveClass : linkClass}>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                        </svg>
                        Bookings</div></Link></li>}


                {user.isAuthenticated && <li ><Link to="/rooms" className={isActive('/rooms') ? ActiveClass : linkClass}>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Rooms
                    </div>
                </Link></li>}


                {user.isAuthenticated && <li ><Link to="/customers" className={isActive('/customers') ? ActiveClass : linkClass}>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                        Customers</div>
                </Link></li>}

                {!user.isAuthenticated && <li ><Link to="/login" className={isActive('/login') ? ActiveClass : linkClass} >
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                        </svg>

                        Login</div>
                </Link></li>}

                {user.isAuthenticated &&

                    <li className={linkClass}><button onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }} className="w-full">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>
                            Logout
                        </div>

                    </button></li>
                }


                {/* <li className={linkClass}><button className="w-full h-full py-2 text-center" id='exitbtn' onClick={()=>{
                    // ipcRenderer.send('app-exit');
                }}>Exit</button></li> */}
            </ul>
            <div className="p-4 flex items-center justify-center gap-4">
            <p>Theme : </p><ThemeToggle></ThemeToggle>

            </div>
        </div>
    </>)
}

export default Sidebar;