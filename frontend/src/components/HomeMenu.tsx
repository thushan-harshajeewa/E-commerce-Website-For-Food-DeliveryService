import React, { useEffect, useState } from "react";
import apiClient from "./services/api-client";
import ManageUsers from './services/user-services'
import { useNavigate } from "react-router-dom";
import { Cart } from "../App";

interface cartID{
  cartID:(cart_id:string)=>void
  cartCondition:()=>void
  //cartItems:(cart_items:Cart)=>void
}

function HomeMenu({cartCondition,cartID}:cartID) {

  
  useEffect(()=>{
    apiClient.post('/store/cart/').then((res)=>{localStorage.setItem("cart_id", JSON.stringify(res.data.id));cartID(res.data.id);cartCondition();})
  },[])
  ManageUsers.CheckTokenAvailability('/');
  
  

  
  return (
    <div>
      <h1>Welcome to the Menu</h1>
      
    </div>
  );
}

export default HomeMenu;
