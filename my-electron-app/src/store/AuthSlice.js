import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated:false,
    username:null,
    role:null,
    token:null,
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login: (state,action)=>{
            state.isAuthenticated=true;
            state.user=action.payload.username;
            state.role=action.payload.role;
            state.token=action.payload.token;
        },
        logout: (state,action)=>{
            state.isAuthenticated=false;
            state.username=null;
            state.role=null;
            state.token=null;
        },
    },
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;