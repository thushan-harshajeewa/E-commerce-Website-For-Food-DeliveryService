import {
  HStack,
  Text,
  Box,
  VStack,
  useNumberInput,
  Button,
  Input,
  Image,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  useDisclosure,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { Cart, CartItem } from "../App";
import ManageCart from "./AddToCart";
import "./css/AlertPopup.css";
import cartEmpty from "../assets/emptycart.png";
import plusButton from "../assets/plusButton.png";
import { useRef, useState } from "react";

interface CartItemQuantity {
  id: number;
  quantity: number;
}

interface ManageCartItems {
  AllCartItems: Cart | undefined;
  cartCondition: () => void;
  
  CartLabelVisible: (visible: boolean) => void;
}

function CartView({
  AllCartItems,
  cartCondition,
  CartLabelVisible,
}: ManageCartItems) {
  const navigate = useNavigate();
  const [cart_id,SetCart_id]=useState<number|null>(null)
  const toast = useToast();
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,

      precision: 0,
    });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const { isOpen: isVisible } = useDisclosure({ defaultIsOpen: false });

  if (AllCartItems?.items.length !== 0) {
    CartLabelVisible(true);
    return (
      <>
        <Box className="visible">
          <VStack spacing={10}>
            {AllCartItems?.items.map((cartItem) => (
              <Box>
                <HStack spacing={8}>
                  <Box>
                    <Text fontSize={"3xl"}>{cartItem.product.title}</Text>
                    <Text>
                      Choice of Size
                      <Text fontWeight={"bold"}>
                        {cartItem.item_price_method}
                      </Text>
                    </Text>
                    <HStack maxW="200px" marginTop={"30px"}>
                      <Button
                        {...inc}
                        onClick={() => {
                          ManageCart.UpdateCart(
                            AllCartItems.id,
                            cartItem.id,
                            cartItem.quantity + 1
                          );
                          cartCondition();
                        }}
                      >
                        +
                      </Button>
                      <Input value={cartItem.quantity} />
                      <Button
                        {...dec}
                        onClick={() => {
                          ManageCart.UpdateCart(
                            AllCartItems.id,
                            cartItem.id,
                            cartItem.quantity - 1
                          );
                          cartCondition();
                        }}
                      >
                        -
                      </Button>
                    </HStack>
                  </Box>
                  <Box>
                    {cartItem.product.images.map((i) => (
                      <Image marginLeft={6} boxSize={"130px"} src={i.image} />
                    ))}
                    <Text marginLeft={6} marginTop={6}>
                      Unit Price
                      <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {cartItem.unit_price}
                      </Text>
                    </Text>
                  </Box>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      SetCart_id(cartItem.id);
                      onOpen();
                    }}
                  >
                    Remove From Cart {cartItem.id}
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Remove From Cart
              </AlertDialogHeader>

              <AlertDialogBody>Are you sure?</AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} as="button">
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  bgColor={"red"}
                  color={"white"}
                  onClick={() => {
                    onClose();

                    ManageCart.DeleteCartItem(AllCartItems?.id, cart_id);
                    toast({
                      title: "Product Removed From Cart",
                      description: "Go Menu To Add Again",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    cartCondition();
                  }}
                  ml={3}
                >
                  Delete 
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  } else {
    CartLabelVisible(false);
    return (
      <>
        <Box>
          <Image marginX={"200px"} src={cartEmpty} />
          <Image
            cursor={"pointer"}
            marginX={"400px"}
            width={"100px"}
            height={"100px"}
            opacity={0.5}
            _hover={{ opacity: 1 }}
            src={plusButton}
            onClick={() => navigate("/home-menu")}
          />
          <Text marginX={"380px"} fontSize={"3xl"}>
            Add Items
          </Text>
        </Box>
      </>
    );
  }
}

export default CartView;
//()=>quantity?.map((item)=>item.id===cartItem.id?item.quantity:unde)
