import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client';
import useUsersErrors from './useUsersErrors';
import ManageUsers from "../services/user-services";

export interface UserDetails{
    first_name:string;
    last_name:string;
    email:string;
}

const useUsers =(status:boolean|string,ProfileStatus:boolean)=> {
    const tokenFromLocalStorage = localStorage.getItem("token");
    if (tokenFromLocalStorage !== null) {
      const token = JSON.parse(tokenFromLocalStorage);
      ManageUsers.AddAccessToken(token.access);
      
    } else {
      
    }

    const [user,SetUser]=useState<UserDetails|null>({} as UserDetails)
    //const {error,setError}=useUsersErrors()
    useEffect(() => {
    
        apiClient.get("/auth/users/me/").then((res) => SetUser(res.data));
      }, [status,ProfileStatus]);
    return {user,SetUser}
}

export default useUsers