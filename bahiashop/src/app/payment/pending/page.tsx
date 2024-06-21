import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import Link from "next/link";

export default function PaymentPending() {
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
