import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  FormLabel,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  ListItem,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cash from "../assets/Cash-PNG-File.png";
import apiClient from "./services/api-client";
import useCustomer from "./hooks/useCustomer";
import { Cart } from "../App";
import { products } from "./hooks/useProducts";

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
  address:string;
  placed_at: string;
  order_status: string;
  customer_id: number;
  items: OrderItem[];
  Total_price: number;
  
}

interface ManageOrderViews {
  cart?: Cart;
  changeCondition: () => void;
  cartID: (cart_id: string) => void;
}

function FinalizingOrder({ cart, changeCondition, cartID }: ManageOrderViews) {
  const { customer } = useCustomer();

  const [address, SetAddress] = useState<string | undefined>();
  const [changeAddress, SetChangeAddress] = useState(false);

  const navigate = useNavigate();
  console.log(address);

  useEffect(() => {
    apiClient
      .get("/store/customer/me/")
      .then((res) => SetAddress(res.data.address));
  }, []);

  function PlacedOrder() {
    if (cart && cart.items.length > 0) {
      apiClient
        .post("/store/orders/", { cart_id: cart.id, address: address })
        .then((res) => {
          apiClient.post("/store/cart/").then((res) => {
            localStorage.setItem("cart_id", JSON.stringify(res.data.id));
            cartID(res.data.id);
            changeCondition();
            navigate("/store/customer/orders");
          });
        });
    }
  }

  function send_email() {
    apiClient.post("/store/emails/", "ok");
  }

  return (
    <>
      <Text fontSize={"4xl"} fontWeight={"bold"}>
        Checkouts
      </Text>
      <FormLabel fontSize={"2xl"}>Address</FormLabel>
      {changeAddress || (
        <HStack>
          <Input marginY={5} color={'yellow'} fontWeight={'bold'} value={address} disabled size="md" />
          <Button onClick={() => SetChangeAddress(true)}>Change</Button>
        </HStack>
      )}
      {changeAddress && (
        <HStack>
          <Input
            marginY={5}
            value={address}
            onChange={(e) => SetAddress(e.target.value)}
            size="md"
          />
          <Button onClick={() => SetChangeAddress(false)}>Update</Button>
        </HStack>
      )}

      <InputGroup margin={0}>
        <InputLeftAddon children="+94" />
        <Input type="tel" color={'yellow'} fontWeight={'bold'} value={customer?.phone} disabled />
      </InputGroup>

      <Text fontSize={"2xl"} marginTop={10}>
        Your Items
      </Text>  


      <Accordion defaultIndex={[5]} allowMultiple width={'700px'}>
  {cart?.items.map((item)=><AccordionItem>
    <h2>
      <AccordionButton>
        <Box fontWeight={'bold'} as="span" flex='1' textAlign='left'>
          {item.product.title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    <SimpleGrid spacing={'1px'} columns={3}>
              <Text color={'yellow'} fontSize={'2xl'}>{item.item_price_method}</Text><Text color={'yellow'} fontSize={'2xl'}>{item.quantity}</Text><Text color={'yellow'} fontSize={'2xl'} fontWeight={'extrabold'}>RS: {item.unit_price}</Text>
            </SimpleGrid>

    </AccordionPanel>
  </AccordionItem>)}
  <Button colorScheme="yellow" size='md' marginTop={5} marginLeft={'620px'} onClick={()=>navigate('/store/cart')}>Update</Button>
  </Accordion>

  <Card marginY={10} width={'500px'}>
        <CardBody>
        <SimpleGrid columns={2} spacing={1}>
          <Text fontSize={"2xl"} marginTop={10}>
            SubTotal
          </Text>
          <Text fontSize={"2xl"} marginTop={10}>
            RS: {cart?.Total_price}
          </Text>
        </SimpleGrid>
        <SimpleGrid columns={2} spacing={1}>
          <Text fontSize={"2xl"} >
            DeliverFee
          </Text>
          <Text fontSize={"2xl"} >
            RS: 0
          </Text>
        </SimpleGrid>
        <SimpleGrid columns={2} spacing={1}>
          <Text color={'yellow'} fontSize={"2xl"} >
            Total
          </Text>
          <Text color={'yellow'} fontWeight={'bold'} fontSize={"2xl"} >
            RS: {cart?.Total_price} 
          </Text>
        </SimpleGrid>
        
            
        </CardBody>
  </Card>

      <Text fontSize={"2xl"} marginTop={10}>
        Select Payment Method
      </Text>
      <Select placeholder="Select option">
        <option value="option1">Cash </option>
        <option value="option2">Credit Card</option>
        <option value="option3">Crypto</option>
      </Select>
      <Img boxSize={"70px"} src={cash} />
      <Button
        marginTop={10}
        onClick={() => {
          send_email();
          PlacedOrder();
          
        }}
       size={'lg'}
       colorScheme="yellow" 
      >
        Place Order
      </Button>
    </>
  );
}

export default FinalizingOrder;
