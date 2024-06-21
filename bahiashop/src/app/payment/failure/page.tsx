"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function PaymentFailure() {
  
  return (
    <MaxWidthWrapper className="flex flex-col">
      <h1>¡Algo salió mal!</h1>
      <p> Por favor vuelve a intentar el pago </p>
      
      <br />
      
      <div className="flex flex-row">
        <Link href="/"> Volver al inicio </Link> - <Link href="/payment"> Ir a pagar </Link>
      </div>
      
    </MaxWidthWrapper>
  );
}
