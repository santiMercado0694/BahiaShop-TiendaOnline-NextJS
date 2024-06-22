import React, { useState } from "react";
import { Product } from "@/context/StoreProvider";
import { FaShoppingCart } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Session } from "next-auth"; // Importa el tipo Session
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CldImage } from "next-cloudinary";

interface ProductDetailsProps {
  product: Product;
  addProductCart: (
    user_id: string,
    id_producto: string,
    quantity: number
  ) => void;
  session: Session | null;
}

const Horizontal = () => <hr className="w-[30%] my-2" />;

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  addProductCart,
  session, 
}) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = (id_producto: string, producto_name: string) => {
    if (session && session.user && session.user.user_id) {
      addProductCart(session.user.user_id, id_producto, quantity);
      toast.success(`Se agregó ${producto_name} al carrito`, {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
      console.log("Agregando producto al carrito");
    } else {
      router.push("/SignIn");
    }
  };

  const handleBuyNow = (id: string) => {
    if (session && session.user && session.user.user_id) {
      addProductCart(session.user.user_id, id, quantity);
      router.push("/payment");
      console.log(`Comprando producto: ${id}`);
    } else {
      router.push("/SignIn");
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <CldImage
          src={product.image_path}
          alt={`${product.name}`}
          width={500}
          height={500}
        />
      </div>
      <div>
        <h1 className="text-2xl font-medium text-slate-700">{product.name}</h1>
        <div className="text-3xl text-justify">
          ${product.price.toLocaleString()}
        </div>
        <Horizontal />
        <div>
          <span className="font-semibold">DETALLE:</span>
        </div>
        <div className="text-justify">{product.details}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">DESCRIPCIÓN:</span>
        </div>
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        {product.stock > 0 ? (
          <>
            <div className="text-teal-400">
              <strong>STOCK DISPONIBLE: {product.stock}</strong>
            </div>
            <Horizontal />
            <div className="flex items-center space-x-2">
              <span className="font-semibold">CANTIDAD:</span>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-200 px-2 py-1 rounded-md"
                  onClick={decrementQuantity}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md text-center"
                  readOnly
                />
                <button
                  className="bg-gray-200 px-2 py-1 rounded-md"
                  onClick={incrementQuantity}
                  disabled={quantity === product.stock}
                >
                  +
                </button>
              </div>
            </div>
            <Horizontal />
            <button
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 mb-6"
              onClick={() => handleBuyNow(product.id)}
            >
              <FaShoppingCart style={{ fontSize: "1rem" }} />
              <span>Comprar ahora</span>
            </button>
            <button
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800 mt-2"
              onClick={() => handleAddToCart(product.id, product.name)}
            >
              <MdAddShoppingCart style={{ fontSize: "1.2rem" }} />
              <span>Agregar al carrito</span>
            </button>
          </>
        ) : (
          <div className="text-rose-400">
            <strong>SIN STOCK DISPONIBLE</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
