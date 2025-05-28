import Signin from "./components/Signin";
import Home from "./components/Home";
import HomeMenu from "./components/HomeMenu";
import ProductItem from "./components/ProductItem";
import Navbar from "./components/Navbar";
import Collection from "./components/Collection";
import SearchField from "./components/SearchField";
import CartView from "./components/CartView";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Alert, Grid, GridItem, HStack,Text, useColorModeValue } from "@chakra-ui/react";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import FectchProducts from "./components/FectchProducts";
import { products } from "./components/hooks/useProducts";
import apiClient from "./components/services/api-client";
import useUsers from "./components/hooks/useUsers";
import { FaMixer } from "react-icons/fa";
import { Genre } from "./components/hooks/useGenre";
import AlertBar from "./components/AlertBar";
import CartPriceLabel from "./components/CartPriceLabel";
import FinalizingOrder from "./components/FinalizingOrder";
import OrderView from "./components/OrderView";
import AllOrderViews from "./components/AllOrderViews";
import TestChannels from "./components/TestChannels";
import UploadImage from "./components/UploadImage";
import CustomerProfile from "./components/CustomerProfile";

export interface CartItem {
  id: number;
  quantity: number;
  product: products;
  unit_price: number;
  item_price_method: string;
  Total_price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  Total_price: number;
}

function App() {
  const [ChangeLoginButton, setLoginButton] = useState(() => {
    const status = localStorage.getItem("status");
    if (status !== null) {
      return status;
    } else return false;
  });

  const [cartID, SetCartID] = useState<string | null>();
  const [Cart, SetCart] = useState<Cart|undefined>();
  const [CartCondition, SetCartCondition] = useState(false);
  const [ProfileCondition, SetProfileCondition] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<string | undefined>("");
  const [CartLableVisible,SetCartLableVisible]=useState<boolean|null>(null)

  const [SelectedGenre, SetSelectedGenre] = useState<
    Genre | null | undefined
  >();

  const [SearchProduct, SetSearchProduct] = useState<string | null>();

  let count = 0;
  Cart?.items.map((item) => {
    count = count + item.quantity;
  });

  const showAlert = (visible: boolean, status?: string) => {
    setIsVisible(visible);
    setAlertStatus(status);
  };

  function ChangeCartCondition() {
    CartCondition ? SetCartCondition(false) : SetCartCondition(true);
  }

  function ChangeProfileCondition() {
    ProfileCondition ? SetProfileCondition(false) : SetProfileCondition(true);
  }


  useEffect(() => {
    const cart_id = localStorage.getItem("cart_id");
    if (cart_id) {
      SetCartID(JSON.parse(cart_id));
      ChangeCartCondition();
    } else {
      SetCartID(null);
    }
  }, []);

  useEffect(() => {
    if (cartID) {
      apiClient.get(`/store/cart/${cartID}`).then((res) => SetCart(res.data));
    }
    else {
      apiClient.post('/store/cart/').then((res)=>{SetCartID(res.data.id);localStorage.setItem("cart_id", JSON.stringify(res.data.id))})
    }
  }, [CartCondition]);

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav" "main" `,
          sm: `"nav" "main" `,
          lg: `"nav nav" "aside main" `,
        }}
        gridTemplateColumns={{ base: "1fr", lg: "150px 1fr" }}
      >
        <GridItem
          bg={useColorModeValue('white', 'gray.900')}
          area="nav"
          position={"fixed"}
          top={0}
          left={0}
          right={0}
          zIndex={10}
          height={'75px'}
          borderStyle={"solid"}
          borderWidth={1}
          borderBottomColor={useColorModeValue('white', 'yellow.400')}

        >
          {" "}
          {isVisible && (
            <AlertBar
              alertStatus={alertStatus}
              showAlert={(visible) => showAlert(visible)}
              visible={isVisible}
            />
          )}
          <Navbar
            handleStatus={(status) => setLoginButton(status)}
            status={ChangeLoginButton}
            ProductQuantity={count}
            ProfileStatus={ProfileCondition}
          />
        </GridItem>
        <GridItem bg={useColorModeValue('white', 'gray.900')} borderWidth={2} borderStyle={"solid"} border={useColorModeValue('white', 'gray.500')} area="aside" position={"fixed"} top={'85px'} width={'150px'}>
        
          <Routes>
            <Route
              path="/home-menu"
              element={
                <Collection
                  ChoosedGenre={SelectedGenre}
                  SelectedGenre={(genre) => {
                    SetSelectedGenre(genre);
                    SetSearchProduct(null);
                  }}
                />
              }
            />
          </Routes>
          
        </GridItem>
        <GridItem bg={useColorModeValue('white', 'gray.800')} area="main" padding={'100px'}>
          
          <div>
            
            <Routes>
              <Route path="/sign" element={<Signin />} />
              <Route
                path="/login"
                element={
                  <Login
                    ChangeLoginButton={(status) => setLoginButton(status)}
                  />
                }
              ></Route>
              <Route
                path="/home-menu"
                element={
                  <>
                    <HomeMenu
                      cartID={(cart_id) => SetCartID(cart_id)}
                      cartCondition={ChangeCartCondition}
                    />
                    <SearchField
                      onSelectSearch={(search) => {
                        SetSearchProduct(search);
                        SetSelectedGenre(null);
                      }}
                    />
                    <FectchProducts
                      showAlert={(visible, status) =>
                        showAlert(visible, status)
                      }
                      SearchProduct={SearchProduct}
                      SelectedGenre={SelectedGenre}
                      cartID={(cart_id) => SetCartID(cart_id)}
                      cartCondition={ChangeCartCondition}
                    />
                  </>
                }
              ></Route>

              <Route
                path="/home-menu/product/:product_id"
                element={
                  <ProductItem
                    cartID={(cart_id) => SetCartID(cart_id)}
                    cartCondition={ChangeCartCondition}
                  />
                }
              />
              
                <Route
                  path="/store/cart"
                  element={
                    <>
                    <Text fontSize={'6xl'} fontWeight={'bold'}>Cart</Text>
                    <HStack spacing={10}>
                      <CartView
                      CartLabelVisible={(visible)=>SetCartLableVisible(visible)}
                        cartCondition={ChangeCartCondition}
                        AllCartItems={Cart}
                      />
                      
                    </HStack>
                    {CartLableVisible && <CartPriceLabel AllCartItems={Cart} />}
                    </>
                  }
                />

              <Route path='/store/cart/checkouts' element={<FinalizingOrder cartID={(id)=>SetCartID(id)} cart={Cart} changeCondition={ChangeCartCondition}/>}/>
              
              <Route path='/store/customer/orders' element={<AllOrderViews />}/>

              <Route path='/store/customer/profile' element={<CustomerProfile profileStatus={ChangeProfileCondition} />}/>



              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </GridItem>
      </Grid>
      
      
    </>
  );
}

export default App;
