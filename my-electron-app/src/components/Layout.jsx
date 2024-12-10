import React from 'react';
import Sidebar from './Sidebar';
const Layout = ({ children }) => {
    return (
        <div className="flex p-4 gap-4 min-h-screen w-full bg-darkbg text-darktext">
            <div className='w-1/3 max-w-xs'>
            <Sidebar/>
            </div>
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default Layout;
