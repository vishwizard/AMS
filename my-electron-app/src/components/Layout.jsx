import React from 'react';
import Sidebar from './Sidebar';
const Layout = ({ children }) => {
    return (
        <div className="flex p-4 gap-4 min-h-screen h-auto w-full bg-white dark:bg-darkbg dark:text-darktext">
            <div className='w-1/5 max-w-xs rounded-lg'>
            <Sidebar/>
            </div>
            <div className="w-full h-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
