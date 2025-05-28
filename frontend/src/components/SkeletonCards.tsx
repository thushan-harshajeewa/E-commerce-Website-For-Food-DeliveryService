import { Card, CardBody, SimpleGrid } from "@chakra-ui/react"
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'




function SkeletonCards() {
  return (
        <Card>
            <Skeleton height={'200px'}></Skeleton>
            <CardBody>
              <SkeletonText></SkeletonText>
            </CardBody>
        </Card>
  )
}

export default SkeletonCards