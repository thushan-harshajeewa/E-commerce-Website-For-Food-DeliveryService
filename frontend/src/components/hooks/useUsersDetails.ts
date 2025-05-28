import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client';

interface UserDetails{
    first_name:string;
    last_name:string;
    email:string;
}


function useUsersDetails() {
    const [user,SetUser]=useState<UserDetails>()
    //const {error,setError}=useUsersErrors()
    useEffect(() => {
    
        apiClient.get("/auth/users/me/").then((res) => SetUser(res.data));
      }, []);
    return {user,SetUser}
}

export default useUsersDetails