import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import Link from "next/link";

export default function PaymentFailure() {
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
