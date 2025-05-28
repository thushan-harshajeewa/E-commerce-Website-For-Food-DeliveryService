import React, { useEffect, useState } from 'react'
import FetchOrders from './FetchOrders';
import { OrderProps } from './OrderView';
import apiClient from './services/api-client';
import { Text } from '@chakra-ui/react'

function CompletedOrders() {
    const [OrderList,SetOrderList]=useState<OrderProps[]>()
    useEffect(()=>{
        apiClient.get("/store/orders/").then((res) => SetOrderList(res.data));
    },[])
  return (
    <>
    <Text fontSize={'4xl'} fontWeight={'bold'} color={'yellow'}>Completed Orders</Text>
    
    { OrderList?.map((order)=>order.order_status==='C'?<FetchOrders order={order} />:null) }
      </>
  )
}
export default CompletedOrders