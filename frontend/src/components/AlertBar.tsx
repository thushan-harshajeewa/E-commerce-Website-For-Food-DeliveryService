import { AlertIcon ,Alert,Text} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'

interface visibility{
  visible:boolean
  showAlert:(visible:boolean)=>void
  alertStatus?:string
}

function AlertBar({visible,showAlert,alertStatus}:visibility) {
  console.log(visible)
  const [isVisible, setIsVisible] = useState<boolean>(visible);



useEffect(() => {
  let timeout: ReturnType<typeof setTimeout>;

  if (isVisible) {
    // Set a timeout to hide the alert after 3 seconds
    timeout = setTimeout(() => {
      setIsVisible(false);
      showAlert(false);
    }, 2000);
  }

  return () => {
    // Clear the timeout when the component unmounts
    clearTimeout(timeout);
  };
}, [isVisible]);
  if (alertStatus==='remove'){
  return (
    <motion.div
    
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: isVisible ?  [0,1,1,1,1,1,1,1,1,1,0] : 0, y: isVisible ? 0 : 0 }}
    transition={{ duration: 2, ease: 'easeInOut' }}
  >
    {isVisible && (
      <Alert fontSize={'xl'} status='warning' borderRadius={10} marginLeft={'400px'} position={"fixed"} top={0} zIndex={10} width={'600px'} height={'100px'}>
        
      <AlertIcon />
      Item Has Removed
        
      </Alert>
    )}
  </motion.div>
  )}
  else if (alertStatus==='add'){
    return (
      <motion.div
      
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: isVisible ?  [0,1,1,1,1,1,1,1,1,1,0] : 0, y: isVisible ? 0 : 0 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    >
      {isVisible && (
        <Alert fontSize={'xl'} status="success" borderRadius={10} marginLeft={'400px'} position={"fixed"} top={0} zIndex={20} width={'600px'} height={'100px'}>
          
        <AlertIcon />
         Item Added To The Cart
        </Alert>
      )}
    </motion.div>
    )}
}

export default AlertBar;