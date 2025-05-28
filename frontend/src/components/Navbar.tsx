import React, { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import "./css/navbar.css";
import { Avatar, Box, DarkMode, HStack, Text } from "@chakra-ui/react";
import { ChangeLoginButton } from "./Login";
import ManageUsers from "./services/user-services";
import useUsers from "./hooks/useUsers";
import Darkmode from "./Darkmode";
import DarkMode2 from "./DarkMode2";
import { FaBasketShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useCustomer from "./hooks/useCustomer";

interface handleStatus {}

interface status {
  status: boolean | string;
  handleStatus: (status: boolean) => void;
  ProductQuantity: number;
  ProfileStatus: boolean;
}

function Navbar({ status, handleStatus, ProductQuantity,ProfileStatus }: status) {
  const [active, setActive] = useState("");
  const { user } = useUsers(status,ProfileStatus);
  const {customer}=useCustomer(ProfileStatus,status)
  const navigate=useNavigate()

  return (
    <>
      <Box paddingLeft={'20px'} paddingRight={'20px'}>
        <HStack  spacing={4} zIndex={10} justifyContent={"space-between"} alignItems={"Center"}>
          <Box marginBottom={4}>
            <HStack spacing={6}>
              {" "}
              {status && (
                <Link className="button" style={{ cursor: "pointer" }} to={"/store/customer/orders"}>
                  {" "}
                  My Orders
                </Link>
              )}
                       {status && (
                <Link style={{ cursor: "pointer" }} to={"/store/cart"}>
                  {" "}
                  <HStack>
                    <FaBasketShopping color="yellow"/><Text fontWeight={'bold'} fontSize={'1.5rem'}>{ProductQuantity}</Text>
                  </HStack>
                </Link>
              )}
            </HStack>
          </Box>
          <Box marginBottom={5}>
            <HStack spacing={10}>
              {" "}
              <Link
                className="button"
        
                  to="/home-menu"
                  
                >
                  Menu
                </Link>
              {status || (
                <Link
                className="button"
        
                  to="/sign"
                  onClick={() => setActive("sign")}
                >
                  SignUp
                </Link>
              )}
              <Link
                className="button"
                to={status ? "/sign" : "/login"}
                onClick={() => {
                  setActive("login");
                  handleStatus(false);
                  ManageUsers.localStorageRemove("status");
                  ManageUsers.localStorageRemove("token");
                  ManageUsers.localStorageRemove("cart_id");
                }}
              >
                {status ? "Log Out" : "Login"}
              </Link>
              {status && <Avatar _hover={{borderStyle:"solid", borderWidth:'2px' ,borderColor:'yellow'}} marginTop={2} cursor={"pointer"} onClick={(()=>navigate('/store/customer/profile'))} marginLeft={'40px'} name={user?.first_name+' '+user?.last_name} src={"http://127.0.0.1:8000" + customer.image}/>}
              {status && <Text className="button" cursor={"pointer"} onClick={(()=>navigate('/store/customer/profile'))} fontWeight={'bold'} fontSize={'1.3rem'} marginTop={4}> {user?.first_name + " " + user?.last_name}</Text>}
              <Box><DarkMode2/></Box>
        
        
            </HStack>
          </Box>
        </HStack>
      </Box>
    </>
  );
}

export default Navbar;
