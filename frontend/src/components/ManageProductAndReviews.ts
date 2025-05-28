import React, { useEffect, useState } from 'react'
import apiClient from './services/api-client';
import { products } from './hooks/useProducts';

class ManageProductsAndReviews{

        FecthProduct(product_id:string|undefined){
            const [productItem,SetProductItem]=useState<products>()
            useEffect(()=>{
                apiClient.get(`/store/products/${product_id}`).then((res)=>SetProductItem(res.data))
            },[])
            return {productItem}

        }
}

export default new ManageProductsAndReviews();