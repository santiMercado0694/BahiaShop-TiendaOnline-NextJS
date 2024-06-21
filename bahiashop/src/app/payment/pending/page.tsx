"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import Link from "next/link";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {getCookie, setCookie} from "@/lib/cookies";
import Loader from "react-loader-spinner";

export default function PaymentPending() {
  
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
        <div className="flex justify-center items-center h-screen">
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={1000}
          />
        </div>
      </MaxWidthWrapper>
    );
  }
  
  return (
    <MaxWidthWrapper className="flex flex-col items-center justify-center h-screen">
      <div className="bg-yellow-400 text-white rounded-lg p-14 shadow-lg">
        <h1 className="text-5xl font-bold mb-8">
          ¡Tu pedido está pendiente de pago!
        </h1>
        <p className="text-2xl mb-10">Por favor finaliza la compra</p>
        <div className="flex flex-row space-x-8 text-3xl">
          {" "}
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
