import React, { useEffect, useState } from 'react'
import OngoingOrders from './OngoingOrders'
import { Tabs, TabList, Tab, TabPanels, TabPanel,Text } from '@chakra-ui/react'
import apiClient from './services/api-client'
import CompletedOrders from './CompletedOrders'
import { OrderProps } from './FinalizingOrder'
import FetchOrders from './FetchOrders'



function AllOrderViews() {

  const [refreshCount, setRefreshCount] = useState(0);
  console.log(refreshCount)
  const [Count,Setcount]=useState(1)
  let countC=0
  let countCA=0
  let countON=0



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
    OrderList?.map((order)=>order.order_status==='C'?countC++:null)
    OrderList?.map((order)=>order.order_status==='CA'?countCA++:null)
    OrderList?.map((order)=>order.order_status !=='C' && order.order_status !=='CA'?countON++:null)

  return (
    <>

   <Tabs marginTop={10}>
  <TabList>
    <Tab>On Going</Tab>
    <Tab>Completed</Tab>
    <Tab>Canceled</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
    <>
    <Text fontSize={'4xl'} fontWeight={'bold'} color={'yellow'}>On Going Orders</Text>
    {countON !==0? OrderList?.map((order)=>order.order_status==='P'?<FetchOrders order={order} />:order.order_status==='A'?<FetchOrders order={order} />:order.order_status==='PR'?<FetchOrders order={order} />:order.order_status==='OW'?<FetchOrders order={order} />:null):<Text fontSize={'2xl'}>No On Going Orders</Text> }
      </>
    </TabPanel>
    <TabPanel>
    <>
    <Text fontSize={'4xl'} fontWeight={'bold'} color={'yellow'}>Completed Orders</Text>
    
    {countC !==0? OrderList?.map((order)=>order.order_status==='C'?<FetchOrders order={order} />:null):<Text fontSize={'2xl'} >No Completed Orders</Text> }
      </>
    </TabPanel>
    <TabPanel>
    <Text fontSize={'4xl'} fontWeight={'bold'} color={'yellow'}>Cancelled Orders</Text>
    {countCA !==0? OrderList?.map((order)=>order.order_status==='CA'?<FetchOrders order={order} />:null):<Text fontSize={'2xl'}>No Cancelled orders Orders</Text> }
    </TabPanel>
  </TabPanels>
</Tabs>
        
        

    </>
  )
}

export default AllOrderViews