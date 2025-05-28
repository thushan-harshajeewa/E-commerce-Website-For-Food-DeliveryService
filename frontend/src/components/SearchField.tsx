import { Input, IconButton, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

interface SearchProduct{
    onSelectSearch:(search:string|null)=>void
}

function SearchField({onSelectSearch}:SearchProduct) {
    const [search,SetSearch]=useState('')
  return (
    <>
    
    <Box display={'flex'} marginY={6} >
    <Input value={search} focusBorderColor='yellow.400' maxW={'300px'} placeholder='Search Product Here' onChange={(e)=>{SetSearch(e.target.value);onSelectSearch(e.target.value)}} />
    <IconButton aria-label='Search database' icon={<IoSearchOutline />} marginLeft={4} backgroundColor='grey.100' onClick={()=>{onSelectSearch(search);SetSearch('')}} />
  </Box>
  </>
  )
}

export default SearchField