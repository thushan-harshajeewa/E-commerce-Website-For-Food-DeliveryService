import {
  Box,
  Text,
  Card,
  CardBody,
  CardFooter,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Button,
  CardHeader,
  Image,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { products } from "./hooks/useProducts";
import { FaShoppingCart } from "react-icons/fa";
import apiClient from "./services/api-client";
import { useNavigate } from "react-router-dom";



interface productItem {
  productItem: products;
  ChoosedProduct:(product_id:number,PriceMethod:string)=>void
  showAlert:(visible:boolean,status:string)=>void
}



function ProductCard({ productItem,ChoosedProduct,showAlert }: productItem) {
      const navigate=useNavigate()
      const [PriceMethod,SetPriceMethod]=useState('normal')
      const toast = useToast()
  //const [SelectedProduct,SetSelectedProduct]=useState<SelectedProduct>({product_id:productItem.id,quantity:1,item_price_method:'normal'})

  //function AddCart(){
    //apiClient.post('/store/cart/').then((res)=>ManageCart.AddToCart(res.data.id,SelectedProduct))
  //}

  return (
    <Card style={{cursor:"pointer"}}   _hover={{
      
      color: "yellow.300",
    }}
   >
    <CardHeader onClick={()=>navigate(`/home-menu/product/${productItem.id}`)}><Text fontWeight={'bold'} fontSize={'2xl'}>{productItem.title}</Text></CardHeader>
      <CardBody onClick={()=>navigate(`/home-menu/product/${productItem.id}`)}>{productItem.images.map((image)=><Image  width={'300px'} height={'260px'} src={image.image} />)}</CardBody>
      <CardFooter justifyContent={"space-between"} >
        {" "}
      
          <RadioGroup onChange={(val)=>SetPriceMethod(val)} >
            <Stack direction="column">
              <Radio value="normal">
                Normal{" "}
                <Text fontWeight={"bold"}>Rs{productItem.unit_price}</Text>
              </Radio>

              <Radio value="full">
                <Text fontSize={"0.5xl"}>
                  Full{" "}
                  <Text fontWeight={"bold"}>Rs{productItem.full_price}</Text>
                </Text>
              </Radio>
            </Stack>
          </RadioGroup>
 
        
          <Stack>
            <Button
              marginTop={'100px'}
              
              rightIcon={<FaShoppingCart />}
              colorScheme="teal"
              variant="outline"
              size={'sm'}
              fontSize={'sm'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              onClick={()=>{ChoosedProduct(productItem.id,PriceMethod);    toast({
                title: 'Product Added Successfully.',
                description: "Go To Carts View Items",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })}}
            
            >
              Add To Cart
            </Button>
          </Stack>
        
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
