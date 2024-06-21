"use client";

import React from "react";
import { useGlobalContext } from "@/context/StoreProvider";
import { usePaymentContext } from "@/context/MPProvider";
import Box from "@mui/material/Box";
import { initMercadoPago } from '@mercadopago/sdk-react';
import Image from 'next/image';
import {setCookie} from "@/lib/cookies";

interface MPButtonProps {
  handleSubmit: () => boolean;
}

export default function MPButton({ handleSubmit }: MPButtonProps) {
  const { cart } = useGlobalContext();
  const { getPreferenceId } = usePaymentContext();

  const [paymentUrl, setPaymentUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (cart.length < 1) return;
    if (!paymentUrl || paymentUrl.trim() === "") {
      initMercadoPago(`${process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY}`);
      const items: any[] = [];
      cart.forEach((it) =>
        items.push({
          title: it.name,
          quantity: it.quantity,
          unit_price: it.price,
        })
      );

      getPreferenceId(items).then((result) => {
        setPaymentUrl(result.init_point!);
      });
    }
  }, [cart, paymentUrl]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    if (handleSubmit()) {
      setCookie('paymentsent', 'true');
      window.location.href = paymentUrl;
    } else {
      console.error(
        "Por favor, complete todos los campos antes de proceder al pago."
      );
    }
  };

  return (
    <Box id="wallet_container" className="mt-4 mb-8 w-full flex justify-center">
      {paymentUrl ? (
        <a
          role="button"
          id="mp_button"
          href={paymentUrl}
          onClick={handleClick}
          className="inline-block"
        >
          <Image
            src="/MercadoPago.webp"
            alt="Pagar con MercadoPago"
            width={300}
            height={200}
            className="hover:opacity-80 transition-opacity duration-300"
          />
        </a>
      ) : (
        <p className="text-center text-gray-500">Cargando...</p>
      )}
    </Box>
  );
}
