"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import {Cart, useGlobalContext} from "@/context/StoreProvider";
import {useEffect, useState} from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import {useSession} from "next-auth/react";

export default function PaymentSuccess() {
  
  const { data: session } = useSession();
  const { cart, updateProductStock, clearCartByUserId } = useGlobalContext();
  
  const [cacheCart, setCacheCart] = useState<Cart[]>([]);

  useEffect(() => {
    
    if(cacheCart.length < 1)
      setCacheCart(cart);
    
    cacheCart.map((prod) => {
      updateProductStock(prod.name, prod.stock - prod.quantity);
    })
    
    if (!session) return;
    clearCartByUserId(session.user.user_id);
    
    
  }, [session, cacheCart, cart]);
  

  return (
    <MaxWidthWrapper className="flex flex-col">
      <h1>¡El pago se ha realizado con éxito!</h1>
      <p> Gracias por comprar en Bahia Shop</p>
      
      <br />
      
      <Link href="/"> Volver al inicio </Link>
    </MaxWidthWrapper>
  );
}
