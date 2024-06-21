"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function PaymentPending() {
  
  return (
    <MaxWidthWrapper className="flex flex-col">
      <h1>¡Tu pedido está pendiente de pago!</h1>
      <p> Por favor finaliza la compra </p>
      
      <br />
      
      <Link href="/payment"> Ir a pagar </Link>
    </MaxWidthWrapper>
  );
}
