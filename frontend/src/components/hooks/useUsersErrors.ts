import { useEffect, useState } from "react";
import apiClient from "../services/api-client";


interface Djangoerror {
    password: string[];
    detail: string;
    email: string[];
  }

function useUsersErrors() {
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [django, SetDjango] = useState<Djangoerror>();

  

  return {show,setShow,error,setError,django,SetDjango}
}

export default useUsersErrors