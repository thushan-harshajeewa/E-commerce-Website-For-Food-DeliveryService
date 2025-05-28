import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client'
import { UserDetails } from './useUsers'

 export interface Customer{
    id: number,
    phone: number,
    birth_date: string,
    address:string,
    image:string
    user:UserDetails
}

function useCustomer(ProfileStatus?:boolean,status?:boolean|string,) {

    const [customer,SetCustomer]=useState<Customer>({} as Customer)
        useEffect(()=>{

                apiClient.get('/store/customer/me/').then((res)=>SetCustomer(res.data))

        },[status,ProfileStatus])
    return {customer,SetCustomer}    
}

export default useCustomer