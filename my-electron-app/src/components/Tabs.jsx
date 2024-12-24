import React, { useState } from 'react'

const Tabs = () => {
    const [state, setState] = useState('dashboard');



    const inactiveClass = 'flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
    const activeClass = inactiveClass + ' bg-gray-100';

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    {/* Left - Dashboard */}
                    <button className={state === 'dashboard' ? activeClass : inactiveClass} onClick={() => setState('dashboard')}>
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Dashboard</span>
                    </button>

                    {/* Center - Profile */}
                    <button className={state === 'dashboard' ? activeClass : inactiveClass} onClick={() => setState('profile')}>
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Profile</span>
                    </button>

                    {/* Right - Settings */}
                    <button className={state === 'dashboard' ? activeClass : inactiveClass} onClick={() => setState('settings')}>
                        <svg
                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Settings</span>
                    </button>
                </div>

                {/* Quote text below */}
                {state === 'dashboard' && <div className="mt-8 text-gray-600 dark:text-gray-400 text-center px-4">
                    <div className='flex justify-between font-bold text-2xl'>
                        <div>Total Sales : </div>
                        <div>Total Customers : </div>
                        <div>Total Rooms : </div>
                    </div>

                </div>}

                {state === 'profile' && <div className="mt-8 text-gray-600 dark:text-gray-400 text-center px-4">
                    <div>
                        Display all users
                    </div>
                </div>}

                {state === 'settings' && <div className="mt-8 text-gray-600 dark:text-gray-400 text-center px-4">
                    <div>
                        <div>Default Theme</div>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default Tabs;