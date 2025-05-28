import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  HStack,
  Img,
  Input,
  Radio,
  RadioGroup,
  Stack,
  
  Textarea,
  
  useColorModeValue,
  useDisclosure,
  useNumberInput,
} from "@chakra-ui/react";
import { IoAdd } from "react-icons/io5";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text
} from '@chakra-ui/react'

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ManageProductsAndReviews from "./ManageProductAndReviews";
import { FaShoppingCart } from "react-icons/fa";
import apiClient from "./services/api-client";
import ManageCart from "./AddToCart";
import { Customer } from "./hooks/useCustomer";

interface cartID{
  cartID:(cart_id:string)=>void
  cartCondition:()=>void
}

interface reviews{
  id:number
  description:string
  date:string
  customer:Customer

}

function ProductItem({cartID,cartCondition}:cartID) {
  const { product_id } = useParams();
  const productID = product_id;
  const { productItem } = ManageProductsAndReviews.FecthProduct(product_id);
  const [PriceMethod,SetPriceMethod]=useState('normal')
  const [quantity, setQuantity] = useState(1);
  const [Review,SetReview]=useState<reviews[]>([])
  const [description,SetDescription]=useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  console.log(quantity)
  //Chakra ui quantity input field
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 100,
      precision: 0,
    });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();
  //....................................

  function AddCart(product_id: number | undefined, PriceMethod: string,quantity:number) {
    let SelectedProduct = {
      product_id: product_id,
      quantity: quantity,
      item_price_method: PriceMethod,
    };
    apiClient
      .post("/store/cart/")
      .then((res) => {ManageCart.AddToCart(res.data.id, SelectedProduct);cartID(res.data.id);cartCondition()});
  }

  useEffect(()=>{

        apiClient.get(`/store/products/${product_id}/reviews/`).then((res)=>SetReview(res.data))

  },[])

  function AddComment(){
    apiClient.post(`/store/products/${product_id}/reviews/`,{description:description}).then((res)=>SetReview([res.data,...Review]))
  }

  return (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <Card
          width={'500px'}
          bg={useColorModeValue('white', 'gray.900')}
          marginTop={10}
          textAlign={"center"}
        >
          <CardHeader><Text marginRight={'100px'} fontSize={'3xl'} fontWeight={'bold'}>{productItem?.title}</Text></CardHeader>
          <CardBody>
            {productItem?.images.map((image)=><Img boxSize={'350px'} src={image.image}/>)}
            <Text fontSize={'xl'} marginY={5} ><span style={{color:'red',fontSize:'30px'}}>"</span>{productItem?.description}<span style={{color:'red',fontSize:'30px'}}>"</span></Text>
          </CardBody>
          <CardFooter justifyContent={"space-between"}>
            {" "}
            <RadioGroup
              onChange={(val) => (SetPriceMethod(val))}
              defaultValue={PriceMethod}
            >
              <Stack direction="column">
                <Radio value="normal">
                  Normal{" "}
                  <Text fontWeight={"bold"}>Rs{productItem?.unit_price}</Text>
                </Radio>

                <Radio value="full">
                  <Text fontSize={"0.5xl"}>
                    Full{" "}
                    <Text fontWeight={"bold"}>Rs{productItem?.full_price}</Text>
                  </Text>
                </Radio>
              </Stack>
            </RadioGroup>
            <Stack>
              <HStack maxW="200px" marginTop={"30px"} >
                <Button {...inc} onClick={() => setQuantity((prev) => Math.min(prev + 1,100))} >+</Button>
                <Input {...input} value={quantity}  />
                <Button {...dec} onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</Button>
              </HStack>
              <Button
                marginTop={"10px"}
                rightIcon={<FaShoppingCart />}
                colorScheme="teal"
                variant="outline"
                size={"sm"}
                fontSize={"sm"}
                onClick={() => AddCart(productItem?.id, PriceMethod,quantity)}
              >
                Add To Cart
              </Button>
            </Stack>
          </CardFooter>
        </Card>
      </Box>
      <Box marginY={10}><Text fontWeight={'bold'} fontSize={'3xl'}>Product Reviews</Text>
    
      <Button leftIcon={<IoAdd />} onClick={onOpen} colorScheme='yellow' >Add Review</Button>
      

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
              <Text>Description</Text>
              
              <Textarea onChange={(e)=>SetDescription(e.target.value)} placeholder='Type Your Comment Here' />
            

           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>{AddComment();onClose()}} >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        {Review?.map((review)=><Card marginY={10} width={'550px'}>
          <CardHeader borderBottom={"solid"} borderBottomColor={'white'} borderBottomWidth={'1px'}><Avatar name={review.customer.user.first_name+' '+review.customer.user.last_name} src={"http://127.0.0.1:8000" + review.customer.image}/>
<Text display={"inline-block"} marginLeft={5} fontWeight={'bold'} fontSize={'xl'}>{review.customer.user.first_name} {review.customer.user.last_name}</Text> </CardHeader>
          <CardBody fontWeight={'bold'} color={'yellow'}>## {review.description}</CardBody>
          <CardFooter>{review.date}</CardFooter>
        </Card>)}

      </Box>
    </>
  );
}

export default ProductItem;
