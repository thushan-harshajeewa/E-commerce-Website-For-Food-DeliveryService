import React, { useEffect, useState } from 'react'
import apiClient from './services/api-client';
import { Card, CardBody, List, ListItem, CardFooter ,Text} from '@chakra-ui/react';
import { OrderProps } from './OrderView';
import FetchOrders from './FetchOrders';

function OngoingOrders() {

  const [refreshCount, setRefreshCount] = useState(0);
  console.log(refreshCount)



    const [OrderList,SetOrderList]=useState<OrderProps[]>()
    useEffect(() => {
      const fetchData = () => {
        apiClient.get("/store/orders/")
          .then(response => {
            SetOrderList(response.data);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
      };
  
      
      fetchData();
  
      
      const intervalId = setInterval(() => {
        fetchData();
      }, 4000);
  
     
      return () => clearInterval(intervalId);
  
      
    }, []);
  return (
    <>
    <Text fontSize={'4xl'} fontWeight={'bold'} color={'yellow'}>On Going Orders</Text>
    { OrderList?.map((order)=>order.order_status==='P'?<FetchOrders order={order} />:order.order_status==='A'?<FetchOrders order={order} />:order.order_status==='PR'?<FetchOrders order={order} />:order.order_status==='OW'?<FetchOrders order={order} />:null) }
      </>
  )
}

export default OngoingOrders