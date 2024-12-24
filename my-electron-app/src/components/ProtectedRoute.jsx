import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("AUth State : ",isAuthenticated);
    if(!isAuthenticated){
        return <Navigate to='/login'/>
    }
  return children;
}

