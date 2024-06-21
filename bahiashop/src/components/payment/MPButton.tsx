import React, {useEffect, useState} from 'react';
import {useGlobalContext} from "@/context/StoreProvider";
import {usePaymentContext} from "@/context/MPProvider";
import Box from "@mui/material/Box";
import { initMercadoPago } from '@mercadopago/sdk-react'
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {toast} from "react-toastify";


export default function MPButton() {
  
  const router = useRouter();
  const { data: session } = useSession();
  const {cart, clearCartByUserId} = useGlobalContext();
  const {getPreferenceId} = usePaymentContext();
  
  const [paymentUrl, setPaymentUrl] = useState(null);
  
  
  useEffect(() => {
    
    if(paymentUrl) return;
    
    if (cart.length < 1) return;
    
    initMercadoPago(`${process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY}`)
    
    let items : any[] = [];
    
    cart.map(it => items.push({
      title: it.name,
      quantity: it.quantity,
      unit_price: it.price
    }))
    
    
    getPreferenceId(items).then((result : any) => {
      setPaymentUrl(result.init_point);
    });
  }, [cart]);
  
  function goHome() {
    if(!session) return;
    clearCartByUserId(session.user.user_id).then(() => {
      
      toast.success(`¡Gracias por comprar en nuestra tienda!`, {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
      
      router.push('/');
      router.refresh();
    })
    
  }
  
  
  return (
    <Box id="wallet_container">
      { paymentUrl ?
        
        <a role="button" className="btn btn-primary align-middle"  href={paymentUrl} onClick={goHome} > Ir a pagar </a>
        
        :
        
        <p> Cargando... </p>
        
      }
    </Box>
  );
}