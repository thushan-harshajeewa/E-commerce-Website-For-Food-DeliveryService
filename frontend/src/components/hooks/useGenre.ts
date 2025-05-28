import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client';

export interface Genre{
    id:number;
    title:string;
    product_count:number;
}

function useGenre() {

        const [Genrelist,SetGenre]=useState<Genre[]>();

        useEffect(()=>{

                apiClient.get('/store/collections').then((res)=>SetGenre(res.data))
        },[])
        return {Genrelist}
}

export default useGenre