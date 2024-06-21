"use client";

import React, { useState, useContext, useEffect, ReactNode } from "react";

export interface Category {
  id: string;
  nombre: string;
}

export interface CartUser {
  cart_id: string;
  user_id: string;
}

export interface Product {
  id: string;
  name: string;
  details: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_path: string;
}

export interface Cart {
  cart_item_id: string;
  cart_id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  image_path: string;
}

export interface User {
  user_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

interface AppContextProps {
  loading: boolean;
  productos: Product[];
  cart: Cart[];
  categories: Category[];
  search: string;
  users: User[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  getProductsFromAPI: () => Promise<void>;
  getProductsByCategory: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product>;
  getProductByName: (name: string) => Promise<Product>;
  getProductStock: (id: string) => Promise<number | null>;
  addProductCart: (
    user_id: string,
    product_id: string,
    quantity: number
  ) => Promise<void>;
  updateProductStock: (name: string, stock: number) => Promise<void>;
  createProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getCartFromCarts: (user_id: string) => Promise<CartUser | null>;
  getCartByUserId: (user_id: string) => Promise<void>;
  getCartItemById: (cart_item_id: string) => Promise<Cart | null>;
  updateCartItemQuantity: (
    user_id: string,
    cart_item_id: string,
    quantity: number
  ) => Promise<void>;
  removeProductFromCart: (
    user_id: string,
    cart_item_id: string
  ) => Promise<void>;
  clearCartByUserId: (user_id: string) => Promise<void>;
  getCategories: () => Promise<void>;
  getCategoriesNames: () => Promise<void>;
  getCategoryById: (id: string) => Promise<Category>;
  getCategoryByName: (name: string) => Promise<Category>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  getUserByName: (name: string) => Promise<void>;
  getUserByEmail: (email: string) => Promise<void>;
  addUser: (
    user: Omit<User, "user_id" | "rol"> & { password: string }
  ) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (user_id: string) => Promise<void>;
  authenticateUser: (email: string, password: string) => Promise<void>;
}

// Crear el contexto
const AppContext = React.createContext<AppContextProps | undefined>(undefined);

// Crear el proveedor
const AppProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const getProductsFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (id: string) => {
    try {
      setLoading(true);
      const url =
        id === "all"
          ? `${process.env.NEXT_PUBLIC_API_URL}/products`
          : `${process.env.NEXT_PUBLIC_API_URL}/products/category/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al obtener los productos por categoría");
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el producto por ID");
      }
      const data = await response.json();
      setLoading(false);
      return data[0];
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return null;
    }
  };

  const getProductByName = async (name: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/name/${name}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el producto por nombre");
      }
      const data = await response.json();
      setLoading(false);
      return data[0];
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return null;
    }
  };

  const getProductStock = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/stock`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el stock del producto");
      }
      const data = await response.json();
      setLoading(false);
      return data.stock;
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return null;
    }
  };

  const addProductCart = async (
    user_id: string,
    product_id: string,
    quantity: number
  ) => {
    try {
      const data = { user_id, product_id, quantity };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la cantidad del producto");
      }
      await getCartByUserId(user_id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateProductStock = async (name: string, stock: number) => {
    try {
      const data = { name, stock };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/stock`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el stock del producto");
      }
      await getProductsFromAPI();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el producto");
      }

      const newProduct = await response.json();
      setProductos((prevProducts) => [...prevProducts, newProduct]);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const updateProduct = async (id: string, product: Omit<Product, "id">) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }

      const updatedProduct = await response.json();
      setProductos((prevProducts) =>
        prevProducts.map((p) => (p.id === id ? updatedProduct : p))
      );
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      setProductos((prevProducts) => prevProducts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const getCartFromCarts = async (user_id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carts/${user_id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el cart por ID");
      }
      const data = await response.json();
      setLoading(false);
      return data[0];
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return null;
    }
  };

  const getCartByUserId = async (user_id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${user_id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el carrito del usuario");
      }
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCartItemById = async (cart_item_id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${cart_item_id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el producto por ID");
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const updateCartItemQuantity = async (
    user_id: string,
    cart_item_id: string,
    quantity: number
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${user_id}/update/${cart_item_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!response.ok) {
        throw new Error(
          "Error al actualizar la cantidad del producto en el carrito"
        );
      }
      await getCartByUserId(user_id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeProductFromCart = async (
    user_id: string,
    cart_item_id: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${user_id}/remove/${cart_item_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el producto del carrito");
      }
      await getCartByUserId(user_id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearCartByUserId = async (user_id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${user_id}/clear`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al vaciar el carrito del usuario");
      }
      await getCartByUserId(user_id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      if (!response.ok) {
        throw new Error("Error al obtener categorías");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategoriesNames = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/names`
      );
      if (!response.ok) {
        throw new Error("Error al obtener nombres de categorías");
      }
      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategoryById = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener la categoría por ID");
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const getCategoryByName = async (name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/name/${name}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener la categoría por nombre");
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createCategory = async (name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: name }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al crear la categoría");
      }
      const data = await response.json();
      setCategories((prevCategories) => [...prevCategories, data]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: name }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la categoría");
      }
      const data = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((category) => (category.id === id ? data : category))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar la categoría");
      }
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Métodos de usuario
  const getUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getUserById = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/id/${id}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener usuario por id");
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getUserByName = async (name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${name}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener usuario por nombre");
      }
      const data = await response.json();
      setUsers([data]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener usuario por email");
      }
      const data = await response.json();
      setUsers([data]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addUser = async (
    user: Omit<User, "user_id" | "rol"> & { password: string }
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Error al añadir usuario");
      }
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data]);
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateUser = async (user: User) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.user_id, rol: user.rol }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }
      await getUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteUser = async (user_id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/delete/${user_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }
      await getUsers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const authenticateUser = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/authenticate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al autenticar usuario");
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getProductsFromAPI();
    getCategories();
    getUsers();
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        productos,
        cart,
        search,
        categories,
        users,
        getProductsFromAPI,
        setCategories,
        setSearch,
        getProductsByCategory,
        getProductById,
        getProductByName,
        getProductStock,
        addProductCart,
        getCartItemById,
        updateProductStock,
        createProduct,
        updateProduct,
        deleteProduct,
        getCartFromCarts,
        getCartByUserId,
        updateCartItemQuantity,
        removeProductFromCart,
        clearCartByUserId,
        getCategories,
        getCategoriesNames,
        getCategoryById,
        getCategoryByName,
        createCategory,
        updateCategory,
        deleteCategory,
        getUsers,
        getUserById,
        getUserByName,
        getUserByEmail,
        addUser,
        updateUser,
        deleteUser,
        authenticateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within an AppProvider");
  }
  return context;
};

export { AppContext, AppProvider };
