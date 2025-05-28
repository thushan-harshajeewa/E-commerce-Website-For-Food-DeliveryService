import { Box, List, ListItem, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import useGenre, { Genre } from './hooks/useGenre'
import { useNavigate } from 'react-router-dom'

interface SelectedGenre{
    SelectedGenre:(genre:Genre|null)=>void
    ChoosedGenre:Genre|null|undefined
}

function Collection({SelectedGenre,ChoosedGenre}:SelectedGenre) {
    const {Genrelist}=useGenre();
    const navigate=useNavigate()
  return (
    <Box >
      <List marginTop={'0px'}>
          <ListItem cursor={'pointer'} _hover={{fontSize:'2xl'}}  marginY={5} onClick={()=>SelectedGenre(null)} >All</ListItem>
          {Genrelist?.map((item)=><ListItem  marginY={6} onClick={()=>SelectedGenre(item)} _hover={{fontSize:'2xl'}} cursor={'pointer'} color={item.id===ChoosedGenre?.id?useColorModeValue('yellow.400', 'yellow.400'):useColorModeValue('grey.900', 'white')} fontWeight={item.id===ChoosedGenre?.id?'extrabold':'light'} >{item.title}</ListItem>)}
      </List>
    </Box>
  )
}

export default Collection