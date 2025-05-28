import React from 'react'
import apiClient from './services/api-client';

export interface SelectedProduct{
    product_id:number |undefined;
    quantity:number;
    item_price_method:string;
  } 

class ManageCart{

        AddToCart(cart_id:string,selectedProduct:SelectedProduct){

            apiClient.post(`/store/cart/${cart_id}/items/`,selectedProduct).then(()=>console.log('ok')).catch((err)=>console.log(err.data))
        }

        UpdateCart(cart_id:string,cartItem_id:number,quantity:number){

          apiClient.patch(`/store/cart/${cart_id}/items/${cartItem_id}/`,{quantity:quantity}).then(()=>console.log('ok'))
        }

        DeleteCartItem(cart_id:string|undefined,cartItem_id:number|null){

          return apiClient.delete(`/store/cart/${cart_id}/items/${cartItem_id}/`).then(()=>console.log(cartItem_id))
        }

}

export default new ManageCart();