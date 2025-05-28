import React, { useEffect } from "react";
import { OrderItem, OrderProps } from "./OrderView";
import {
  Card,
  CardBody,
  List,
  ListItem,
  CardFooter,
  Text,
  Progress,
  Box,
  Alert,
  AlertIcon,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

interface prop {
  order: OrderProps;

}

function FetchOrders({ order }: prop) {
  const steps = [
    { title: "Pending", description: "Request Your Order" },
    { title: "Accepted", description: "Order Accepted" },
    { title: "Preparing", description: "Preparing Order" },
    { title: 'On The Way', description: 'Order Is On The Way' },
  ];

  
    const { activeStep, setActiveStep } = useSteps({
      index: 1,
      count: steps.length,
    });



    useEffect(()=>{
      {order?.order_status === "P"
      ? setActiveStep(1)
      : order?.order_status === "A"
      ? setActiveStep(2)
      : order?.order_status === "PR"
      ? setActiveStep(3)
      : order?.order_status === "OW"
      ? setActiveStep(4)
      : order?.order_status === "C"
      ? "Completed"
      : null}
    },[order.order_status])

    return (
      <>
        <Card marginY={5}>
          <CardBody>
            <Text marginY={10} fontSize={"3xl"} fontWeight={"bold"}>
              Items
            </Text>
       

            <Accordion defaultIndex={[5]} allowMultiple width={'700px'}>
  {order?.items.map((item)=><AccordionItem>
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
  </Accordion>

            <Text marginY={10} fontSize={"2xl"} fontWeight={"bold"}>
              Sub Total Is: Rs {order?.Total_price}
            </Text>

            <Text fontSize={"xl"} fontWeight={"bold"}>
              Deliver To:  <Text display={"inline-block"} fontWeight={'bold'} >{order?.address}</Text>
            </Text>

            <CardFooter>
              <Text fontSize={"xl"} fontWeight={"bold"} color={"yellow"}>
                Your Order Is{" "}
                <Text display={"inline-block"} color={order?.order_status === "A"?'green':'yellow'} >
                  {order?.order_status === "P"
                    ? "Pending"
                    : order?.order_status === "A"
                    ? "Accepted"
                    : order?.order_status === "PR"
                    ? "Preparing"
                    : order?.order_status === "OW"
                    ? "On The Way"
                    : order?.order_status === "C"
                    ? "Completed"
                    : 'Cancelled'}
                </Text>
              </Text>
              
            </CardFooter>
          </CardBody>
        </Card>
        {order.order_status !== 'CA' && order.order_status !== 'C'?<Stepper index={activeStep} colorScheme='yellow' >
      {steps.map((step, index) => (
        <Step key={index}  >
          <StepIndicator>
            <StepStatus
              complete={`✅`}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>:null}
    {order.order_status !== 'CA' && order.order_status !== 'C'? <Progress
          size="xs"
          height={3}
          isIndeterminate
          colorScheme={order?.order_status === "P" ? "yellow" : "green"}
        />:null}
        {order.order_status==='C'&&  <Alert status='success' bg={'green'}>
    <AlertIcon />
    Your Order Completed Successfully.
  </Alert>}
  {order.order_status==='CA'&&  <Alert status='warning' bg={'red'}>
    <AlertIcon />
    This Order Is Cancelled.
  </Alert>}
      </>
    );
  }

export default FetchOrders;
