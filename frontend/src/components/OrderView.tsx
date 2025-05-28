import React, { useEffect, useState } from "react";
import ManageUser from "./services/user-services";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Cart } from "../App";
import apiClient from "./services/api-client";
import { products } from "./hooks/useProducts";
import { useNavigate } from "react-router-dom";

export interface OrderItem {
  id: number;
  quantity: number;
  product: products;
  unit_price: number;
  item_price_method: string;
  Total_price: number;
}

export interface OrderProps {
  id: number;
  placed_at: string;
  order_status: string;
  customer_id: number;
  items: OrderItem[];
  Total_price: number;
  address:string
}

interface ManageOrderViews {
  cart?: Cart;
  changeCondition: () => void;
  cartID:(cart_id:string)=>void
}

function OrderView({ cart, changeCondition ,cartID}: ManageOrderViews) {

  ManageUser.CheckTokenAvailability('/')
  
  const [Order, SetOrder] = useState<OrderProps>();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      apiClient.post("/store/orders/", { cart_id: cart.id }).then((res) => {
        SetOrder(res.data);
        
      });
    }
  }, []);

  useEffect(()=>{
    apiClient.post('/store/cart/').then((res)=>{localStorage.setItem("cart_id", JSON.stringify(res.data.id));cartID(res.data.id);changeCondition();navigate('/store/customer/orders')})
  },[])

  if (cart && cart.items.length > 0) {
    return (
      <>
        <Card>
          <CardBody>
            <h2>Items</h2>
            <List>
              {Order?.items.map((item) => (
                <ListItem>
                  {item.product.title} {item.item_price_method} {item.quantity}
                </ListItem>
              ))}
            </List>
            <Text>Sub Total Is: Rs {Order?.Total_price}</Text>
            <CardFooter>
              Your Order Is{" "}
              {Order?.order_status === "P" ? "Pending" : "Completed"}
            </CardFooter>
          </CardBody>
        </Card>
        <Button colorScheme='yellow' onClick={(()=>{navigate('/store/customer/orders')})}>Track Order</Button>
      </>
    );
  } 
}

export default OrderView;
