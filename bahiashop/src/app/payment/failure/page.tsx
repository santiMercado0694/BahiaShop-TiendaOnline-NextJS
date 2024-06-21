"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getCookie, setCookie} from "@/lib/cookies";

export default function PaymentFailure() {
  
  
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    
    getCookie('paymentsent').then(result => {
      
      if (!result || result != 'true') {
        router.push('/');
        return;
      }
      
      setCookie('paymentsent', '');
      setLoading(false);
    });
  }, [loading]);
  
  
  if (loading) {
    return (
      <MaxWidthWrapper className="flex flex-col items-center justify-center h-screen">
        <h1>Cargando...</h1>
      </MaxWidthWrapper>
    );
  }
  
  
  return (
    <MaxWidthWrapper className="flex flex-col items-center justify-center h-screen">
      <div className="bg-red-500 text-white rounded-lg p-14 shadow-lg">
        <h1 className="text-5xl font-bold mb-8">¡Ups! Algo salió mal.</h1>
        <p className="text-2xl mb-10">Por favor, vuelve a intentar el pago.</p>
        <div className="flex flex-row space-x-8 text-3xl">
          <Link href="/" passHref>
            <span className="text-white cursor-pointer hover:underline hover:text-gray-200 transition-colors duration-300">
              Volver a la tienda
            </span>
          </Link>{" "}
          <Link href="/payment" passHref>
            <span className="text-white cursor-pointer hover:underline hover:text-gray-200 transition-colors duration-300">
              Ir a pagar
            </span>
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
