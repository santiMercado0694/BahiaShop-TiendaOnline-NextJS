"use client";

import Cart from "@/components/cart/Cart";
import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import { ProductCard } from "@/components/product/ProductCard";
import { useGlobalContext } from "@/context/StoreProvider";
import {useEffect, useState} from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import {useSession} from "next-auth/react";

export default function PaymentSuccess() {
  
  const { data: session } = useSession();
  const { cart, getProductStock, updateProductStock, clearCartByUserId } = useGlobalContext();
  
  const [stockUpdated, setStockUpdated] = useState<boolean>(false);

  useEffect(() => {
    
    if (stockUpdated) return;
    
    if (!session) return;
    
    cart.forEach(async (prod) => {
      const stock = await getProductStock(prod.cart_item_id);
      if (!stock) return;
      
      const newValue = stock - prod.quantity;
      await updateProductStock(prod.cart_item_id, newValue);
      
    })
    
    clearCartByUserId(session.user.user_id);
    setStockUpdated(true);
    
  }, [session]);

  return (
    <MaxWidthWrapper className="flex flex-col">
      <h1>¡El pago se ha realizado con éxito!</h1>
      <p> Gracias por comprar en Bahia Shop</p>
      
      <br />
      
      <Link href="/"> Volver al inicio </Link>
    </MaxWidthWrapper>
  );
}
