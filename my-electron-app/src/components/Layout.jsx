import React from 'react';
import Sidebar from './Sidebar';
const Layout = ({ children }) => {
    return (
        <div className="flex p-4 gap-4 layout min-h-screen min-w-full bg-darkbg text-darktext">
            <div className='w-1/3'>
            <Sidebar/>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Layout;
