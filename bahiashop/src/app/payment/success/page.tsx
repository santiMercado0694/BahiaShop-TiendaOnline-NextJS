"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import { Cart, useGlobalContext } from "@/context/StoreProvider";
import { useEffect, useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, updateProductStock, clearCartByUserId } = useGlobalContext();

  const [cacheCart, setCacheCart] = useState<Cart[]>([]);

  useEffect(() => {
    if (cacheCart.length < 1) setCacheCart(cart);

    cacheCart.map((prod) => {
      updateProductStock(prod.name, prod.stock - prod.quantity);
    });

    if (!session) return;
    clearCartByUserId(session.user.user_id);
  }, [session, cacheCart, cart]);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <MaxWidthWrapper className="flex flex-col items-center justify-center h-screen">
      <div className="bg-green-400 text-white rounded-lg p-14 shadow-lg">
        <h1 className="text-5xl font-bold mb-8">
          ¡El pago se ha realizado con éxito!
        </h1>
        <p className="text-2xl mb-10">Gracias por comprar en Bahia Shop</p>
        <div className="flex flex-row space-x-8 text-3xl">
          {" "}
          <Link href="/payment" passHref>
            <span className="text-white cursor-pointer hover:underline hover:text-gray-200 transition-colors duration-300">
              Volver a la Tienda
            </span>
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
