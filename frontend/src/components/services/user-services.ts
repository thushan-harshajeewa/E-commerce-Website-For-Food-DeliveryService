import { useEffect } from "react";
import apiClient from "./api-client";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";




 export interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
  }

class ManageUsers{

  //Manage tokens
  CreateUserToken(data:FieldValues){
    return apiClient.post("/auth/jwt/create", data)
  }
    
    AddAccessToken(token:string){
        if (token) {
            apiClient.defaults.headers.common["Authorization"] = `JWT ${token}`;
          } else delete apiClient.defaults.headers.common["Authorization"];
    }

    setTokenToLocalStorage(token: any) {
      localStorage.setItem("token", JSON.stringify(token));
    }
    
    //Manage user register and logout functions

    userSign(data:FieldValues){
       return  apiClient.post("/auth/users/", data)
    }


    UpdateCustomer(data:FieldValues){

        return  apiClient.put("/store/customer/me/",data)
    }

    setloginButtonToLocalStorage(status:boolean){
      localStorage.setItem("status", JSON.stringify(status));
    }

    localStorageRemove(param:any){
      localStorage.removeItem(param)
    }

    CheckTokenAvailability (navigateTo:string){
      const navigate = useNavigate();
      const tokenFromLocalStorage = localStorage.getItem("token");
      if (tokenFromLocalStorage !== null) {
        const token = JSON.parse(tokenFromLocalStorage);
        this.AddAccessToken(token.access);
        
      } else {
        useEffect(() => {
          navigate(navigateTo)
        }, []);
      }
    }




}

export default new ManageUsers();