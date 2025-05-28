import React, { useEffect, useState } from 'react'
import { products } from './useProducts';
import apiClient from '../services/api-client';
import { Cart } from '../../App';


export interface OrderItem {
    id: number;
    quantity: number;
    product: products;
    unit_price: number;
    item_price_method: string;
    Total_price: number;
  }

interface OrderProps{
    id: number;
    placed_at: string;
    payment_status: string;
    customer_id: number;
    items:OrderItem[];
    Total_price:number;
}

export interface ManageOrder{
    cart:string|null|undefined
}

function useOrder({cart}:ManageOrder) {
    console.log(cart)

    const [Order,SetOrder]=useState<OrderProps>()

    useEffect(()=>{

        apiClient.post('/store/orders/',{cart_id:cart}).then((res)=>SetOrder(res.data))

    },[cart])
    return {Order}
}

export default useOrder