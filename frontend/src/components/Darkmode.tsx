import { Switch,useColorMode,HStack,Image, Box } from "@chakra-ui/react"

//import sun from '../assets/sun.png'

function Darkmode() {
    const { colorMode, toggleColorMode } = useColorMode()
  return (
    <>
    
    <Box>
      <HStack>
      <Switch size={'sm'} colorScheme="yellow" isChecked={colorMode==='dark'} onChange={toggleColorMode}/>
     
      </HStack>
    </Box>
    
        
    
  

</>
  )
}

export default Darkmode