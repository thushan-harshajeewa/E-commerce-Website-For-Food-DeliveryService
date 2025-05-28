import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client'
import { AxiosRequestConfig } from 'axios'

interface ProductImages{
    id:number
    image:string
}
export interface products {
    id:number;
    title:string;
    unit_price:number;
    full_price:number;
    description:string;
    images:ProductImages[];
}

const useProducts =(productFilter?:AxiosRequestConfig,deps?:any[]) =>{
    const [products,SetProducts]=useState<products[]>([])
    const [loading,SetLoading]=useState(false)

    useEffect(()=>{
        SetLoading(true)
            apiClient.get('/store/products',{...productFilter}).then((res)=>{SetProducts(res.data);SetLoading(false)})
    },deps?[...deps]:[])
    return {products,SetProducts,loading}
}

export default useProducts