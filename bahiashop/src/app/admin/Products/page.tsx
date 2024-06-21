"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import { useGlobalContext, Product } from "@/context/StoreProvider";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/utils";
import NotFound from "@/app/not-found";
import { CldImage, CldUploadButton } from "next-cloudinary";

const AdminProductPanel = () => {
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const { data: session } = useSession();
  const [admin, setAdmin] = useState<boolean>(false);
  const {
    productos,
    categories,
    getProductsFromAPI,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useGlobalContext();
  const [formData, setFormData] = useState({
    productName: "",
    productDetails: "",
    productDescription: "",
    productCategory: "",
    productPrice: "",
    productStock: "",
    productImage: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const router = useRouter();

  useEffect(() => {
    getProductsFromAPI();
    setAdmin(session ? isAdmin(session) : false);
  }, []);

  if (!admin) {
    return <NotFound />;
  }

  const filteredProducts = productos.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories
        .find((category) => category.id === String(product.category_id))
        ?.nombre.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Volver a la página 1 cuando se busca
  };

  const navigateToAdmin = () => {
    router.push("/admin");
  };

  const handleFormChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "productPrice" && parseFloat(value) < 0) {
      setFormData((prevData) => ({
        ...prevData,
        productPrice: "0",
      }));
    } else if (name === "productStock" && parseFloat(value) < 0) {
      setFormData((prevData) => ({
        ...prevData,
        productStock: "0",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newProduct: Omit<Product, "id"> = {
        name: formData.productName,
        details: formData.productDetails,
        description: formData.productDescription,
        category_id: parseInt(formData.productCategory),
        price: parseFloat(formData.productPrice),
        stock: parseInt(formData.productStock),
        image_path: imagePath,
      };

      await createProduct(newProduct);
      setAddProductModal(false);
      toast.success(`Se creó el producto ${newProduct.name} exitosamente!`, {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });

      setFormData({
        productName: "",
        productDetails: "",
        productDescription: "",
        productCategory: "",
        productPrice: "",
        productStock: "",
        productImage: "",
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      toast.error("Error al crear el producto", {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.name,
      productDetails: product.details,
      productDescription: product.description,
      productCategory: String(product.category_id),
      productPrice: String(product.price),
      productStock: String(product.stock),
      productImage: product.image_path,
    });
    setImagePath(product.image_path);
    setEditProductModal(true);
  };

  const handleUpdateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProduct || !formData) return;

    try {
      const updatedProduct: Product = {
        ...selectedProduct,
        id: selectedProduct.id,
        name: formData.productName,
        details: formData.productDetails,
        description: formData.productDescription,
        category_id: parseInt(formData.productCategory),
        price: parseFloat(formData.productPrice),
        stock: parseInt(formData.productStock),
        image_path: imagePath,
      };

      await updateProduct(updatedProduct.id, updatedProduct);
      setEditProductModal(false);
      setFormData({
        productName: "",
        productDetails: "",
        productDescription: "",
        productCategory: "",
        productPrice: "",
        productStock: "",
        productImage: "",
      });
      toast.success(`Se edito el producto exitosamente!`, {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      toast.error("Error al editar el producto", {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      setDeleteProductModal(false);
      toast.success(
        `Se eliminó el producto ${selectedProduct.name} exitosamente!`,
        {
          position: "top-right",
          style: {
            width: "300px",
            fontSize: "1rem",
          },
        }
      );
    } catch (error) {
      toast.error("Error al eliminar el producto", {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    }
  };

  const onUploadSuccess = async (result: any) => {
    setImagePath(result.info.public_id);
    formData.productImage = imagePath;
  };

  return (
    <MaxWidthWrapper>
      <section className="dark:bg-gray-900 p-4 sm:p-5 antialiased">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.817A6 6 0 012 8z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar Producto"
                  className="w-full p-2 pl-10 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAddProductModal(true)}
                  className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-1.5 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                  Agregar Producto
                </button>
                <button
                  type="button"
                  onClick={navigateToAdmin}
                  className="flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Panel Principal
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Producto
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Categoria
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Stock
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b dark:border-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                        <CldImage
                          width={50}
                          height={50}
                          src={product.image_path}
                          alt={"Product Image"}
                          className="mr-3"
                        />
                        {product.name}
                      </td>

                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {categories.find(
                          (category) =>
                            category.id === String(product.category_id)
                        )?.nombre || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center mr-3">
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center mr-3">
                          ${product.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 ">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              handleEditProduct(product);
                              setEditProductModal(true);
                            }}
                            className="flex items-center justify-center text-green-600 bg-green-100 hover:bg-green-200 focus:ring-4 focus:ring-green-300 border border-green-300 rounded-lg text-sm font-medium px-4 py-2"
                          >
                            <FaEdit className="mr-2" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(product);
                              setDeleteProductModal(true);
                            }}
                            className="flex items-center justify-center text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:ring-red-300 border border-red-300 rounded-lg text-sm font-medium px-4 py-2"
                          >
                            <FaRegTrashAlt className="mr-2" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center p-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 ${
                    currentPage === index + 1
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-blue-400"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Modal
        show={addProductModal}
        size="md"
        popup
        onClose={() => {
          setAddProductModal(false);
          setFormData({
            productName: "",
            productDetails: "",
            productDescription: "",
            productCategory: "",
            productPrice: "",
            productStock: "",
            productImage: "",
          });
          setImagePath("");
        }}
      >
        <Modal.Header className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          Agregar Producto
        </Modal.Header>
        <Modal.Body className="relative p-4 w-full max-w-3xl h-full md:h-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-4 w-full max-w-4xl mx-auto">
              <div className="mb-4">
                <label
                  htmlFor="productName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  value={formData.productName}
                  onChange={handleFormChange}
                  maxLength={30}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productDetails"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Detalles del Producto(Maximo 50 Caracteres)
                </label>
                <input
                  type="text"
                  name="productDetails"
                  id="productDetails"
                  value={formData.productDetails}
                  onChange={handleFormChange}
                  maxLength={50}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productDescription"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Descripción del Producto
                </label>
                <textarea
                  name="productDescription"
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productCategory"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Categoria del Producto
                </label>
                <select
                  name="productCategory"
                  id="productCategory"
                  value={formData.productCategory}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="" disabled>
                    Seleccione una categoría
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Precio del Producto
                </label>
                <input
                  type="number"
                  name="productPrice"
                  id="productPrice"
                  value={formData.productPrice}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productStock"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Stock del Producto
                </label>
                <input
                  type="number"
                  name="productStock"
                  id="productStock"
                  value={formData.productStock}
                  onChange={handleFormChange}
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productImage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Imagen del Producto
                </label>
                <CldUploadButton
                  uploadPreset="unsigned_1"
                  onSuccess={onUploadSuccess}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Subir Imagen
                </CldUploadButton>
                {imagePath ? (
                  <CldImage src={imagePath} alt="" width={300} height={200} />
                ) : (
                  ""
                )}
              </div>

              <div className="w-full flex justify-start mt-4">
                <Button type="submit">Agregar Producto</Button>
                <Button
                  onClick={() => {
                    setAddProductModal(false);
                    setFormData({
                      productName: "",
                      productDetails: "",
                      productDescription: "",
                      productCategory: "",
                      productPrice: "",
                      productStock: "",
                      productImage: "",
                    });
                    setImagePath("");
                  }}
                  color="gray"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={editProductModal}
        size="md"
        popup
        onClose={() => {
          setEditProductModal(false);
          setFormData({
            productName: "",
            productDetails: "",
            productDescription: "",
            productCategory: "",
            productPrice: "",
            productStock: "",
            productImage: "",
          });
          setImagePath("");
        }}
      >
        <Modal.Header className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          Editar Producto
        </Modal.Header>
        <Modal.Body className="relative p-4 w-full max-w-3xl h-full md:h-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <form onSubmit={handleUpdateProduct}>
            <div className="mb-4 w-full max-w-4xl mx-auto">
              <div className="mb-4">
                <label
                  htmlFor="productName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  value={formData.productName}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productDetails"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Detalles del Producto(Maximo 50 Caracteres)
                </label>
                <input
                  type="text"
                  name="productDetails"
                  id="productDetails"
                  value={formData.productDetails}
                  onChange={handleFormChange}
                  maxLength={50}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productDescription"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Descripción del Producto
                </label>
                <textarea
                  name="productDescription"
                  id="productDescription"
                  value={formData.productDescription}
                  rows={10}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productCategory"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Categoria del Producto
                </label>
                <select
                  name="productCategory"
                  id="productCategory"
                  value={formData.productCategory}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Precio del Producto
                </label>
                <input
                  type="number"
                  name="productPrice"
                  id="productPrice"
                  value={formData.productPrice}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productStock"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Stock del Producto
                </label>
                <input
                  type="number"
                  name="productStock"
                  id="productStock"
                  value={formData.productStock}
                  onChange={handleFormChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="productImage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Imagen del Producto
                </label>
                <CldUploadButton
                  uploadPreset="unsigned_1"
                  onSuccess={onUploadSuccess}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Subir Imagen
                </CldUploadButton>
                {imagePath ? (
                  <CldImage
                    src={imagePath}
                    alt={
                      selectedProduct?.name
                        ? selectedProduct.name
                        : "Product Image"
                    }
                    width={300}
                    height={200}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-start md:space-x-3 flex-shrink-0">
              <Button type="submit">Guardar Cambios</Button>
              <Button
                onClick={() => {
                  setEditProductModal(false);
                  setFormData({
                    productName: "",
                    productDetails: "",
                    productDescription: "",
                    productCategory: "",
                    productPrice: "",
                    productStock: "",
                    productImage: "",
                  });
                  setImagePath("");
                }}
                color="gray"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={deleteProductModal}
        size="md"
        popup
        onClose={() => setDeleteProductModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro que deseas eliminar el producto{" "}
              {selectedProduct?.name}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteProduct}>
                Sí, estoy seguro
              </Button>
              <Button color="gray" onClick={() => setDeleteProductModal(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </MaxWidthWrapper>
  );
};

export default AdminProductPanel;
