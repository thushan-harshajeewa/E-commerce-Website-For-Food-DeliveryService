import React from "react";
import { Link } from "react-router-dom";
import CaptionCarousel from "./CaptionCarousal";
import { Box } from "@chakra-ui/react";


function Home() {
  const tokenFromLocalStorage = localStorage.getItem("token");
  return (
    <>
      <div className="container">
        <h1>Welcome to Our Website</h1>
        <Box border={10}  width={'750px'}><CaptionCarousel/></Box>
        <p>Your awesome website description goes here.</p>
        {tokenFromLocalStorage?<Link to="/home-menu" className="btn btn-danger">
          Order Now
        </Link>:<Link to="/login" className="btn btn-danger" >
          Order Now
        </Link>}
      </div>
    </>
  );
}

export default Home;
