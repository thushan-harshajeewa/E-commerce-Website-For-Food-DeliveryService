import { Box, border, useColorModeValue } from "@chakra-ui/react"
import { ReactNode } from "react"


interface props{
    children:ReactNode
}


function ProductContainer({children}:props) {
  return (
    <Box _hover={{borderStyle:'solid',borderWidth:1,borderColor:useColorModeValue('white', 'yellow.400')}} borderRadius={10} overflow={'hidden'} >{children}</Box>
  )
}

export default ProductContainer;